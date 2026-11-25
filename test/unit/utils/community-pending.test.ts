import { describe, expect, it } from 'vitest'
import {
  gvizSheetUrl,
  parseCommunityPending,
  parseDevsPendentes,
  parseRelatosNovos,
  parseTestersPendentes,
} from '~/utils/community-pending'

// Fixtures baseadas no CSV gviz REAL da planilha (16/11/2026)
const TESTADORES_CSV = [
  '"nome","email","avatar_url","bio","foco","linkedin","github","instagram","outros","ativo","desde","status"',
  '"Jeydson","garciajeydson@gmail.com","","Trabalhar para missão","app-desktop","","","","","FALSE","","pendente"',
  '"Aprovado Antes","aprovado@x.com","","bio","web","","","","","TRUE","2026-11-01","aprovado"',
].join('\r\n')

const DEVS_CSV = [
  '"timestamp","nome","email","bio","github","portfolio","areas","disponibilidade","stack","motivacao","status"',
  '"2026-11-10T01:06:03.245Z","","invalid","","","","","","","","pendente"',
  '"2026-11-13T00:01:59.250Z","Felipe Nascimento Santos","fn0501925@gmail.com","Apaixonado por tecnologia","https://github.com/Lipesantos658","","Web/PWA,Mobile (Flutter),TVs/Receiver","Noites e fins de semana","Node.js, PostgreSQL","crescimento","pendente"',
  '"2026-11-13T00:12:34.277Z","Lucas da Silva Vieira","lucassilvavieira2102@gmail.com","Estudante de ADS","https://github.com/lucas","","Web,PWA","Noites","Vue, Node","aprender","aprovado"',
].join('\r\n')

const RELATOS_CSV = [
  '"timestamp","testador","email","tipo","url","descricao","passos","versao","plataforma","status","data_import"',
  '"2026-11-14T10:00:00Z","Ezequias","eze@x.com","bug","https://x","Letra não abre","1. abrir","1.37","web","novo",""',
  '"2026-11-14T11:00:00Z","Ezequias","eze@x.com","bug","https://x","Resolvido antes","1. abrir","1.37","web","resolvido",""',
].join('\r\n')

describe('parseTestersPendentes', () => {
  it('filtra apenas status=pendente com nome válido', () => {
    const res = parseTestersPendentes(TESTADORES_CSV)
    expect(res).toHaveLength(1)
    expect(res[0]?.nome).toBe('Jeydson')
    expect(res[0]?.email).toBe('garciajeydson@gmail.com')
    expect(res[0]?.foco).toBe('app-desktop')
    expect(res[0]?.status).toBe('pendente')
    expect(res[0]?.row).toBe(2) // linha 2 da sheet
  })

  it('retorna vazio para CSV vazio/malformado sem crash', () => {
    expect(parseTestersPendentes('')).toEqual([])
    expect(parseTestersPendentes('lixo sem csv válido')).toEqual([])
  })
})

describe('parseDevsPendentes', () => {
  it('filtra apenas status=pendente (Felipe sim, Lucas aprovado não, linha sem nome não)', () => {
    const res = parseDevsPendentes(DEVS_CSV)
    expect(res).toHaveLength(1)
    expect(res[0]?.nome).toBe('Felipe Nascimento Santos')
    expect(res[0]?.github).toBe('https://github.com/Lipesantos658')
    expect(res[0]?.row).toBe(3)
  })
})

describe('parseRelatosNovos', () => {
  it('filtra apenas status=novo', () => {
    const res = parseRelatosNovos(RELATOS_CSV)
    expect(res).toHaveLength(1)
    expect(res[0]?.nome).toBe('Ezequias')
    expect(res[0]?.descricao).toBe('Letra não abre')
    expect(res[0]?.status).toBe('novo')
  })
})

describe('parseCommunityPending', () => {
  it('agrega as 3 abas com erro=false', () => {
    const res = parseCommunityPending(TESTADORES_CSV, DEVS_CSV, RELATOS_CSV)
    expect(res.erro).toBe(false)
    expect(res.testers).toHaveLength(1)
    expect(res.devs).toHaveLength(1)
    expect(res.relatos).toHaveLength(1)
  })
})

describe('gvizSheetUrl', () => {
  it('appenda sheet= com encoding seguro', () => {
    const base = 'https://docs.google.com/spreadsheets/d/X/gviz/tq?tqx=out:csv'
    expect(gvizSheetUrl(base, 'testadores')).toBe(`${base}&sheet=testadores`)
    expect(gvizSheetUrl('https://x', 'des env')).toBe('https://x?sheet=des%20env')
  })
})
