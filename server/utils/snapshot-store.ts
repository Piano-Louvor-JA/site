import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Snapshot store persistente — fonte de EXIBIÇÃO de todos os dados GitHub.
 *
 * Hierarquia: snapshot em disco (sempre disponível) ← sincronizador (ETag condicional)
 *             A API GitHub NUNCA é consultada no caminho do visitante.
 *
 * Persistência: arquivo local no servidor (`~/.piano-site-snapshots.json` ou
 * `.data/` do processo). Sobrevive a restart. Local-first: se o arquivo existe,
 * ele é a verdade; o sincronizador apenas o atualiza quando o GitHub muda.
 */

interface SnapshotEnvelope {
  data: unknown
  etag: string | null
  updatedAt: string
}

const SNAPSHOT_DIR = process.env.SNAPSHOTS_DIR || join(process.cwd(), '.data')
const SNAPSHOT_FILE = join(SNAPSHOT_DIR, 'github-snapshots.json')

type SnapshotKey =
  | 'all-downloads'
  | 'latest-app-release'
  | 'releases'
  | 'contributors'
  | 'total-downloads'
  | 'recent-activity'

function readStore(): Record<string, SnapshotEnvelope> {
  try {
    return JSON.parse(readFileSync(SNAPSHOT_FILE, 'utf-8'))
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, SnapshotEnvelope>): void {
  try {
    mkdirSync(SNAPSHOT_DIR, { recursive: true })
    writeFileSync(SNAPSHOT_FILE, JSON.stringify(store, null, 2))
  } catch (e) {
    console.error('[snapshots] falha ao persistir:', e instanceof Error ? e.message : e)
  }
}

/** Lê o snapshot persistido (fonte primária de exibição). Retorna null se nunca sincronizou. */
export function readSnapshot(key: SnapshotKey): SnapshotEnvelope | null {
  const store = readStore()
  return store[key] ?? null
}

/** Grava/atualiza snapshot após sincronização bem-sucedida (200 com payload novo). */
export function writeSnapshot(key: SnapshotKey, data: unknown, etag: string | null): void {
  const store = readStore()
  store[key] = { data, etag, updatedAt: new Date().toISOString() }
  writeStore(store)
}

/** Salva apenas o ETag quando a resposta é 304 (não mudou — mantém dados, atualiza etag de controle). */
export function saveEtag(key: SnapshotKey, etag: string): void {
  const store = readStore()
  const cur = store[key]
  if (cur) {
    cur.etag = etag
    writeStore(store)
  }
}

export function getEtag(key: SnapshotKey): string | null {
  return readStore()[key]?.etag ?? null
}
