import { describe, expect, it } from 'vitest'
import { devicesByUf, heatFill, maxDevices, onlineByUf } from '../../../app/utils/brMapHeat'

describe('brMapHeat', () => {
  it('agrega dispositivos por UF', () => {
    expect(
      devicesByUf([
        { region: 'sp', devices: 2 },
        { region: 'SP', devices: 3 },
        { region: 'BA', devices: 1 },
      ]),
    ).toEqual({ SP: 5, BA: 1 })
  })

  it('agrega online agora por UF', () => {
    expect(
      onlineByUf([
        { region: 'ma', online: 1 },
        { region: 'MA', online: 4 },
        { region: 'SP', online: 0 },
      ]),
    ).toEqual({ MA: 5, SP: 0 })
  })

  it('maxDevices ignora vazio', () => {
    expect(maxDevices({})).toBe(0)
    expect(maxDevices({ SP: 4, BA: 9 })).toBe(9)
  })

  it('heatFill escurece com mais acessos', () => {
    const cold = heatFill(0, 10)
    const mid = heatFill(5, 10)
    const hot = heatFill(10, 10)
    expect(cold).toBe('rgb(207, 224, 204)')
    expect(mid).not.toBe(cold)
    expect(hot).not.toBe(mid)
    // canal G do hot (#15803d) é menor que do base
    const g = (s: string) => Number(s.match(/rgb\((\d+), (\d+), (\d+)\)/)![2])
    expect(g(hot)).toBeLessThan(g(cold))
  })
})
