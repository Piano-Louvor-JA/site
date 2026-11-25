/**
 * Community pending — leitura client-side gviz CSV público (SPEC piano-admin-comunidade v1.0.0).
 *
 * Substitui a rota Nitro /api/admin/community/pending (404 em hosting SSG).
 * Fonte: planilha 'PIANO — Relatos de Testadores' pública (qualquer um com link).
 * ADR-001: gviz CSV client-side, sem OAuth, sem segredo no bundle.
 * Escrita de moderação (aprovar/rejeitar) permanece fora de escopo v1.
 */
import { parseGvizCsv, type RawRow } from './testers-sheet'

export interface TesterPendente {
  row: number
  tab: 'testadores'
  nome: string
  email: string
  bio: string
  foco: string
  links: string
  status: string
}

export interface DevPendente {
  row: number
  tab: 'desenvolvedores'
  nome: string
  email: string
  bio: string
  github: string
  portfolio: string
  areas: string
  disponibilidade: string
  stack: string
  status: string
}

export interface RelatoNovo {
  row: number
  tab: 'relatos'
  nome: string
  email: string
  tipo: string
  versao: string
  modulo: string
  descricao: string
  passos: string
  status: string
}

export interface CommunityPending {
  testers: TesterPendente[]
  devs: DevPendente[]
  relatos: RelatoNovo[]
  /** true quando o carregamento FALHOU (fetch rejeitou) — UI deve ocultar listas. */
  erro: boolean
}

function pick(row: RawRow, aliases: string[]): string {
  for (const key of aliases) {
    const v = row[key]
    if (typeof v === 'string' && v.trim().length > 0) return v.trim()
  }
  return ''
}

/** Índice da coluna 'status' cabeçalho-insensível (lowercase, trim). */
function statusOf(row: RawRow): string {
  return pick(row, ['status', 'Status', 'STATUS']).toLowerCase()
}

export function parseTestersPendentes(csv: string): TesterPendente[] {
  return parseGvizCsv(csv)
    .map((row, idx) => {
      const links = [
        pick(row, ['linkedin']),
        pick(row, ['github']),
        pick(row, ['instagram']),
        pick(row, ['outros', 'outro', 'other']),
      ]
        .filter(Boolean)
        .join(' · ')
      return {
        row: idx + 2, // linha 1-based na sheet (cabeçalho = linha 1)
        tab: 'testadores' as const,
        nome: pick(row, ['nome', 'name', 'testador']),
        email: pick(row, ['email']),
        bio: pick(row, ['bio', 'sobre']),
        foco: pick(row, ['foco', 'focus', 'plataforma']),
        links,
        status: statusOf(row),
      }
    })
    .filter((t) => t.nome.length >= 2 && t.status === 'pendente')
}

export function parseDevsPendentes(csv: string): DevPendente[] {
  return parseGvizCsv(csv)
    .map((row, idx) => ({
      row: idx + 2,
      tab: 'desenvolvedores' as const,
      nome: pick(row, ['nome', 'name']),
      email: pick(row, ['email']),
      bio: pick(row, ['bio', 'sobre']),
      github: pick(row, ['github']),
      portfolio: pick(row, ['portfolio', 'portfólio']),
      areas: pick(row, ['areas', 'áreas', 'area']),
      disponibilidade: pick(row, ['disponibilidade']),
      stack: pick(row, ['stack']),
      status: statusOf(row),
    }))
    .filter((d) => d.nome.length >= 2 && d.status === 'pendente')
}

export function parseRelatosNovos(csv: string): RelatoNovo[] {
  return parseGvizCsv(csv)
    .map((row, idx) => ({
      row: idx + 2,
      tab: 'relatos' as const,
      nome: pick(row, ['testador', 'nome', 'name']),
      email: pick(row, ['email']),
      tipo: pick(row, ['tipo', 'type', 'status_tipo']),
      versao: pick(row, ['versao', 'versão', 'version']),
      modulo: pick(row, ['modulo', 'módulo', 'onde', 'url']),
      descricao: pick(row, ['descricao', 'descrição', 'description']),
      passos: pick(row, ['passos', 'passo', 'steps']),
      status: statusOf(row),
    }))
    .filter((r) => r.status === 'novo')
}

export function parseCommunityPending(
  testersCsv: string,
  devsCsv: string,
  relatosCsv: string,
): CommunityPending {
  return {
    testers: parseTestersPendentes(testersCsv),
    devs: parseDevsPendentes(devsCsv),
    relatos: parseRelatosNovos(relatosCsv),
    erro: false,
  }
}

/** URL gviz para uma aba da sheet de testadores. */
export function gvizSheetUrl(baseUrl: string, sheet: string): string {
  const sep = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${sep}sheet=${encodeURIComponent(sheet)}`
}
