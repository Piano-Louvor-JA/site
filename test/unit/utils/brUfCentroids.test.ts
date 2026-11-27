import { describe, expect, it } from 'vitest'
import { projectBrPoint } from '../../../app/utils/brUfCentroids'

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

  it('offset determinístico por cidade na mesma UF', () => {
    const a = projectBrPoint('SP', 'Campinas')
    const b = projectBrPoint('SP', 'Santos')
    const c = projectBrPoint('SP', 'Campinas')
    expect(a).toEqual(c)
    expect(a).not.toEqual(b)
  })

  it('UF desconhecida retorna null', () => {
    expect(projectBrPoint('XX', 'Somewhere')).toBeNull()
  })
})
