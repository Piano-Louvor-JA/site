import { describe, expect, it } from 'vitest'
import { BR_UF_NAMES, projectBrPoint } from '../../../app/utils/brUfCentroids'

describe('projectBrPoint', () => {
  it('projeta UF conhecida dentro do mapa', () => {
    const sp = projectBrPoint('SP', null)
    expect(sp).not.toBeNull()
    expect(sp!.left).toBeGreaterThan(2)
    expect(sp!.left).toBeLessThan(98)
    expect(sp!.top).toBeGreaterThan(2)
    expect(sp!.top).toBeLessThan(98)
  })

  it('posiciona Bahia à direita/centro e Acre à esquerda', () => {
    const ba = projectBrPoint('BA', null)!
    const ac = projectBrPoint('AC', null)!
    const rr = projectBrPoint('RR', null)!
    const rs = projectBrPoint('RS', null)!
    expect(ba.left).toBeGreaterThan(ac.left)
    expect(ba.left).toBeGreaterThan(70)
    expect(rr.top).toBeLessThan(ba.top)
    expect(rs.top).toBeGreaterThan(ba.top)
  })

  it('São Luís fica no litoral norte do Maranhão (não no centroide)', () => {
    const ma = projectBrPoint('MA', null)!
    const sl = projectBrPoint('MA', 'São Luís')!
    // mais ao norte → top menor; mais a leste → left maior
    expect(sl.top).toBeLessThan(ma.top - 5)
    expect(sl.left).toBeGreaterThan(ma.left)
    // Costa norte do MA no SVG (~74.9% / 17.4%)
    expect(sl.left).toBeGreaterThan(74)
    expect(sl.left).toBeLessThan(76)
    expect(sl.top).toBeGreaterThan(16.5)
    expect(sl.top).toBeLessThan(18.5)
  })

  it('usa coordenadas reais e ignora acento/caixa', () => {
    const a = projectBrPoint('MA', 'São Luís')
    const b = projectBrPoint('MA', 'sao luis')
    const c = projectBrPoint('SP', 'Campinas')
    const d = projectBrPoint('SP', 'Santos')
    expect(a).toEqual(b)
    expect(c).not.toEqual(d)
  })

  it('cidade desconhecida: offset determinístico na mesma UF', () => {
    const a = projectBrPoint('SP', 'Cidade Inventada A')
    const b = projectBrPoint('SP', 'Cidade Inventada B')
    const c = projectBrPoint('SP', 'Cidade Inventada A')
    expect(a).toEqual(c)
    expect(a).not.toEqual(b)
  })

  it('UF desconhecida retorna null', () => {
    expect(projectBrPoint('XX', 'Somewhere')).toBeNull()
  })

  it('tem nome legível para todas as UFs com centroide', () => {
    expect(BR_UF_NAMES.MA).toBe('Maranhão')
    expect(BR_UF_NAMES.SP).toBe('São Paulo')
  })
})
