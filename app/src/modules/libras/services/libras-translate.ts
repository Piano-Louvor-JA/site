import type { LibrasTranslation } from '../types';
import { normalizeLyrics } from '../types';
import { getTranslation, saveTranslation } from './libras-cache';

// URL do serviço público VLibras (conforme documentação)
const VLIBRAS_API_URL = 'https://traducao2.vlibras.gov.br/translate';
const TRANSLATE_TIMEOUT_MS = 15000; // 15s (SPEC)

/**
 * Realiza a chamada HTTP para o serviço VLibras (POST, timeout 15s, falha silenciosa).
 * @param normalizedLyrics Letra normalizada.
 * @returns Promise<string | null> Gloss ou null em falha.
 */
async function fetchGlossFromVLibras(normalizedLyrics: string): Promise<string | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TRANSLATE_TIMEOUT_MS);
    try {
        const response = await fetch(VLIBRAS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: normalizedLyrics }),
            signal: controller.signal,
        });
        if (!response.ok) return null;
        const data = await response.json() as { gloss?: string };
        return data.gloss ?? null;
    } catch {
        return null; // falha silenciosa conforme SPEC
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Obtém o gloss de forma idempotente: Cache > API > Fallback Local.
 * @param lyrics Letra original não normalizada.
 * @returns Promise<{ gloss: string | null, sourceUsed: 'cache' | 'api' | 'fallback' }>
 */
export async function getLibrasGloss(lyrics: string): Promise<{ gloss: string | null, sourceUsed: 'cache' | 'api' | 'fallback' }> {
    const normalized = normalizeLyrics(lyrics);
    const cacheKey = normalized; // B6
    
    // 1. Tentar Cache (RÁPIDO)
    let cached = await getTranslation(cacheKey);
    if (cached) {
        return { gloss: cached.gloss, sourceUsed: 'cache' };
    }

    // 2. Tentar API (MOCKADO, será null)
    let gloss = await fetchGlossFromVLibras(normalized);
    if (gloss) {
        // 3. Salvar no Cache (para uso futuro)
        const newTranslation: LibrasTranslation = {
            cacheKey: cacheKey,
            gloss: gloss,
            source: lyrics,
            createdAt: Date.now(),
        };
        await saveTranslation(newTranslation);
        return { gloss: gloss, sourceUsed: 'api' };
    }

    // 4. Fallback Local (ACESSIBILIDADE MÍNIMA, conforme SPEC)
    console.warn('LibrasTranslate: Falha em Cache e API. Usando fallback datilologia local.');
    const fallbackGloss = datilologia(normalized);
    return { gloss: fallbackGloss, sourceUsed: 'fallback' };
}

/**
 * Fallback local: datilologia (letra a letra, sinal manual do alfabeto).
 * Cada palavra vira letras maiúsculas separadas por espaço; espaço entre
 * palavras vira "_".
 * Não-alfabéticos são descartados; palavra sem caracteres alfabéticos = "_".
 */
function datilologia(normalized: string): string {
    const words = normalized.split(' ');
    const fingerspelled = words.map((word) => {
        const letters = word.toUpperCase().replace(/[^A-ZÀ-Ü0-9]/g, '');
        return letters ? letters.split('').join(' ') : '_';
    });
    return fingerspelled.join(' _ ');
}