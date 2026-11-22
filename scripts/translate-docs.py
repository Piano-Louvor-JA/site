#!/usr/bin/env python3
"""Onda 3 F4 — tradução das docs via API z.ai/GLM (a mesma que o site usa p/ changelogs).
Glossário BARRA Onda 2 no system prompt; preserva números/URLs/código; frontmatter traduzido
(title/description), nav_order/platform/reviewed_at/toc intactos.
Uso: python3 scripts/translate-docs.py <locale> [slug ...]   (sem slugs = todas faltantes)
"""
import os, sys, json, time, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'content/docs/pt-BR'
KEY = os.environ.get('HERMES_CUSTOM_ZAI_API_KEY')
MODEL = os.environ.get('TRANSLATE_MODEL', 'glm-4.6')
# GLM Coding Plan — endpoint de assinatura (o api/paas comum exige saldo pay-per-use)
API = 'https://api.z.ai/api/coding/paas/v4/chat/completions'

LANG_NAME = {
 'es':'Spanish','ru':'Russian','uk':'Ukrainian','fr':'French','ja':'Japanese',
 'ko':'Korean','zh':'Simplified Chinese (简体中文)','tr':'Turkish','ar':'Modern Standard Arabic (فصحى)','hi':'Hindi',
}
EXTRA = {
 'ar': 'Use formal Christian Modern Standard Arabic (فصحى) as used in Arabic Bible editions. Deus = الله. RTL language.',
 'hi': 'Use formal Adventist Christian Hindi. Deus/God = परमेश्वर; Sabbath = सब्बाथ; church = गिरजाघर.',
 'zh': 'Use Simplified Chinese (简体中文), NOT Traditional.',
}
GLOSSARY = {
 'en': 'PIANO LouvorJA stays in Latin script; keep "Hinário Adventista" as "Adventist Hymnal"; "Escola Sabatina" as "Sabbath School".',
 'default': 'Keep "PIANO LouvorJA" and "LouvorJA" exactly in Latin script (never transliterate). Hymnal/hinário Adventista and Sabbath School use the standard Adventist terminology of the target language. Keep product UI feature names consistent within the doc set.',
}

def sys_prompt(locale):
    return (
        f"You are a professional translator for a Christian worship projection app (PIANO LouvorJA, Seventh-day Adventist context). "
        f"Translate Brazilian Portuguese markdown documentation to {LANG_NAME[locale]}. {EXTRA.get(locale, '')} {GLOSSARY['default']} "
        "RULES: (1) Preserve ALL markdown structure exactly: headings levels, numbered/ordered lists, tables (| syntax), code blocks (``` and inline `code`), bold **, links [text](/docs/...) — translate link TEXT but keep link URLs unchanged. "
        "(2) Preserve numbers, version strings, URLs, e-mails, keyboard keys (ESC, Ctrl+Alt+P), file extensions and product codes exactly. "
        "(3) Preserve the YAML frontmatter block between --- lines: translate ONLY the values of 'title:' and 'description:'; keep 'nav_order', 'platform', 'reviewed_at', 'toc' values untouched. "
        "(4) Natural, fluent register for church media volunteers — not machine-literal. (5) Output ONLY the translated markdown, no explanations."
    )

def translate(text, locale, retries=3) -> str:
    import urllib.request
    body = json.dumps({
        'model': MODEL,
        'messages': [
            {'role': 'system', 'content': sys_prompt(locale)},
            {'role': 'user', 'content': text},
        ],
        'temperature': 0.3,
        'max_tokens': 16000,
        'thinking': {'type': 'disabled'},
    }).encode()
    for attempt in range(retries):
        req = urllib.request.Request(API, data=body, headers={
            'Authorization': f'Bearer {KEY}', 'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                out = json.load(r)
            txt = str(out['choices'][0]['message']['content']).strip()
            # sanity: frontmatter preservado
            if text.startswith('---\n') and not txt.startswith('---\n'):
                raise ValueError('frontmatter perdido')
            if '```' in text and txt.count('```') != text.count('```'):
                raise ValueError('code fence alterado')
            return txt
        except Exception as e:
            if attempt == retries - 1:
                raise
            # Coding Plan retorna 429 por janela de requisições; não martelar a quota.
            wait = 300 if getattr(e, 'code', None) == 429 else 15 * (attempt + 1)
            print(f'  retry {attempt+1}: {e}; aguardando {wait}s', flush=True)
            time.sleep(wait)
    raise RuntimeError('unreachable')

def main():
    locale = sys.argv[1]
    slugs = sys.argv[2:]
    if not KEY:
        sys.exit('SEM CHAVE: HERMES_CUSTOM_ZAI_API_KEY ausente')
    outdir = ROOT / f'content/docs/{locale}'
    files = sorted(SRC.rglob('*.md'))
    done = skipped = 0
    for f in files:
        rel = f.relative_to(SRC)
        if slugs and not any(s in str(rel) for s in slugs):
            continue
        dest = outdir / rel
        if dest.exists():
            skipped += 1
            continue
        src_text = f.read_text(encoding='utf-8')
        t0 = time.time()
        out = translate(src_text, locale)
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(out + ('\n' if not out.endswith('\n') else ''), encoding='utf-8')
        done += 1
        print(f'{locale}/{rel}: {len(src_text)}→{len(out)}B {time.time()-t0:.0f}s', flush=True)
        # Coding Plan: limitar a 1 requisição/minuto evita 429 por burst.
        time.sleep(60) if f != files[-1] else None
    print(f'RESUMO {locale}: {done} traduzidas, {skipped} já existentes')

if __name__ == '__main__':
    main()
