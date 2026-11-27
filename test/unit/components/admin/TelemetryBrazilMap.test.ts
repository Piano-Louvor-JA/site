import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TelemetryBrazilMap from '../../../../app/components/admin/TelemetryBrazilMap.vue'
import type { MapPoint } from '../../../../app/composables/useTelemetryHistory'
import { projectBrPoint } from '../../../../app/utils/brUfCentroids'

const point = (over: Partial<MapPoint> = {}): MapPoint => ({
  city: 'Santos',
  region: 'SP',
  country: 'BR',
  devices: 2,
  online: 1,
  is_online: true,
  ...over,
})

describe('TelemetryBrazilMap', () => {
  it('sem pontos: mostra mensagem vazia, legenda zerada e nenhum pin', () => {
    const w = mount(TelemetryBrazilMap, { props: { points: [] } })
    expect(w.findAll('button.tmap__pin')).toHaveLength(0)
    expect(w.find('.tmap__empty').exists()).toBe(true)
    expect(w.find('.tmap__empty').text()).toBe(
      'Ainda não há acessos com cidade/UF no Brasil neste período.',
    )
    const legend = w.find('.tmap__legend').text()
    expect(legend).toContain('Online agora (0)')
    expect(legend).toContain('Acesso nos últimos 90 dias (0)')
    expect(w.find('.tmap__legend').attributes('aria-hidden')).toBe('true')
  })

  it('estrutura base: canvas com role img, svg e silhueta do Brasil', () => {
    const w = mount(TelemetryBrazilMap, { props: { points: [] } })
    const canvas = w.find('.tmap__canvas')
    expect(canvas.attributes('role')).toBe('img')
    expect(canvas.attributes('aria-label')).toBe('Mapa do Brasil com acessos')
    expect(w.find('svg.tmap__br').attributes('viewBox')).toBe('0 0 100 100')
    expect(w.find('path.tmap__land').exists()).toBe(true)
  })

  it('pontos online e offline: renderiza pins, classes, títulos e contagens', () => {
    const w = mount(TelemetryBrazilMap, {
      props: {
        points: [
          point({ city: 'Santos', region: 'SP', devices: 3, is_online: true }),
          point({ city: 'Recife', region: 'PE', devices: 1, online: 0, is_online: false }),
          point({ city: 'Manaus', region: 'AM', devices: 5, is_online: true }),
        ],
      },
    })
    const pins = w.findAll('button.tmap__pin')
    expect(pins).toHaveLength(3)
    expect(w.find('.tmap__empty').exists()).toBe(false)

    expect(pins[0]!.classes()).toContain('tmap__pin--on')
    expect(pins[0]!.classes()).not.toContain('tmap__pin--off')
    expect(pins[0]!.attributes('title')).toBe('Santos / SP · 3 acesso(s) · online agora')
    expect(pins[0]!.attributes('aria-label')).toBe('Santos / SP · 3 acesso(s) · online agora')
    expect(pins[0]!.attributes('type')).toBe('button')

    expect(pins[1]!.classes()).toContain('tmap__pin--off')
    expect(pins[1]!.classes()).not.toContain('tmap__pin--on')
    expect(pins[1]!.attributes('title')).toBe('Recife / PE · 1 acesso(s) · offline (90d)')

    const legend = w.find('.tmap__legend').text()
    expect(legend).toContain('Online agora (2)')
    expect(legend).toContain('Acesso nos últimos 90 dias (1)')
  })

  it('posiciona o pin em % conforme projectBrPoint', () => {
    const w = mount(TelemetryBrazilMap, {
      props: { points: [point({ city: 'Santos', region: 'SP' })] },
    })
    const pos = projectBrPoint('SP', 'Santos')!
    const style = w.find('button.tmap__pin').attributes('style')!
    expect(style).toContain(`left: ${pos.left}%`)
    expect(style).toContain(`top: ${pos.top}%`)
  })

  it('ponto sem cidade usa apenas a UF no título', () => {
    const w = mount(TelemetryBrazilMap, {
      props: { points: [point({ city: null, region: 'BA', devices: 4, is_online: false })] },
    })
    const pin = w.find('button.tmap__pin')
    expect(pin.attributes('title')).toBe('BA · 4 acesso(s) · offline (90d)')
  })

  it('ponto com cidade vazia também usa apenas a UF', () => {
    const w = mount(TelemetryBrazilMap, {
      props: { points: [point({ city: '', region: 'RS', devices: 1 })] },
    })
    expect(w.find('button.tmap__pin').attributes('title')).toBe('RS · 1 acesso(s) · online agora')
  })

  it('ignora pontos com UF desconhecida e mostra mensagem vazia se nenhum couber', () => {
    const w = mount(TelemetryBrazilMap, {
      props: { points: [point({ region: 'XX' }), point({ region: '' })] },
    })
    expect(w.findAll('button.tmap__pin')).toHaveLength(0)
    expect(w.find('.tmap__empty').exists()).toBe(true)
    expect(w.find('.tmap__legend').text()).toContain('Online agora (0)')
  })

  it('mistura UF válida e inválida: só renderiza as válidas, sem mensagem vazia', () => {
    const w = mount(TelemetryBrazilMap, {
      props: { points: [point({ region: 'XX' }), point({ region: 'rj', city: 'Niterói' })] },
    })
    const pins = w.findAll('button.tmap__pin')
    expect(pins).toHaveLength(1)
    expect(pins[0]!.attributes('title')).toContain('Niterói / rj')
    expect(w.find('.tmap__empty').exists()).toBe(false)
  })

  it('pins de mesma região/cidade mantêm chaves distintas (múltiplos pins)', () => {
    const w = mount(TelemetryBrazilMap, {
      props: { points: [point(), point(), point({ is_online: false })] },
    })
    expect(w.findAll('button.tmap__pin')).toHaveLength(3)
    expect(w.findAll('.tmap__pin--on')).toHaveLength(2)
    expect(w.findAll('.tmap__pin--off')).toHaveLength(1)
  })

  it('reage à atualização das props', async () => {
    const w = mount(TelemetryBrazilMap, { props: { points: [] } })
    expect(w.findAll('button.tmap__pin')).toHaveLength(0)
    await w.setProps({ points: [point()] })
    expect(w.findAll('button.tmap__pin')).toHaveLength(1)
    expect(w.find('.tmap__empty').exists()).toBe(false)
  })
})
