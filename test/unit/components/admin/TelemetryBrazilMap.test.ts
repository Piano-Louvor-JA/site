import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
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

const stubSvg = `<?xml version="1.0"?><svg viewBox="0 0 10 10"><path id="BR-SP" title="São Paulo" d="M0 0"/><path id="BR-BA" title="Bahia" d="M1 1"/></svg>`

describe('TelemetryBrazilMap', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        text: async () => stubSvg,
      })),
    )
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sem pontos: mostra mensagem vazia, legenda zerada e nenhum pin', async () => {
    const w = mount(TelemetryBrazilMap, { props: { points: [] } })
    await flushPromises()
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

  it('estrutura base: canvas, host SVG, toolbar de zoom e barra de calor', async () => {
    const w = mount(TelemetryBrazilMap, { props: { points: [] } })
    await flushPromises()
    const canvas = w.find('.tmap__canvas')
    expect(canvas.attributes('role')).toBe('img')
    expect(canvas.attributes('aria-label')).toBe('Mapa do Brasil com acessos')
    expect(w.find('.tmap__br').exists()).toBe(true)
    expect(w.find('.tmap__heat-bar').exists()).toBe(true)
    expect(w.find('button[aria-label="Aproximar"]').exists()).toBe(true)
    expect(w.find('button[aria-label="Afastar"]').exists()).toBe(true)
    expect(w.find('button[aria-label="Resetar zoom"]').exists()).toBe(true)
  })

  it('mostra nome do estado, online no momento e únicos (90d) no centroide', async () => {
    const w = mount(TelemetryBrazilMap, {
      props: {
        points: [
          point({ city: 'São Luís', region: 'MA', devices: 2, online: 1, is_online: true }),
          point({ city: 'Imperatriz', region: 'MA', devices: 3, online: 0, is_online: false }),
        ],
      },
    })
    await flushPromises()
    const uf = w.find('.tmap__uf')
    expect(uf.exists()).toBe(true)
    expect(uf.find('.tmap__uf-name').text()).toBe('MARANHÃO')
    expect(uf.find('.tmap__uf-online').text().replace(/\s+/g, ' ').trim()).toBe('1 online')
    expect(uf.find('.tmap__uf-count').text()).toBe('5 únicos · 90d')
    expect(uf.attributes('title')).toContain('1 online')
    expect(uf.attributes('title')).toContain('5 único(s) nos últimos 90 dias')
  })

  it('não mostra badge de online quando a UF está zerada', async () => {
    const w = mount(TelemetryBrazilMap, {
      props: {
        points: [point({ city: 'Belém', region: 'PA', devices: 3, online: 0, is_online: false })],
      },
    })
    await flushPromises()
    const uf = w.find('.tmap__uf')
    expect(uf.find('.tmap__uf-online').exists()).toBe(false)
    expect(uf.find('.tmap__uf-count').text()).toBe('3 únicos · 90d')
    expect(uf.attributes('title')).not.toContain('online')
  })

  it('pontos online e offline: renderiza pins, classes, títulos e contagens', async () => {
    const w = mount(TelemetryBrazilMap, {
      props: {
        points: [
          point({ city: 'Santos', region: 'SP', devices: 3, online: 2, is_online: true }),
          point({ city: 'Recife', region: 'PE', devices: 1, online: 0, is_online: false }),
          point({ city: 'Manaus', region: 'AM', devices: 5, online: 3, is_online: true }),
        ],
      },
    })
    await flushPromises()
    const pins = w.findAll('button.tmap__pin')
    expect(pins).toHaveLength(3)
    expect(w.find('.tmap__empty').exists()).toBe(false)

    expect(pins[0]!.classes()).toContain('tmap__pin--on')
    expect(pins[0]!.attributes('title')).toBe('Santos / SP · 3 acesso(s) · online agora')
    expect(pins[1]!.classes()).toContain('tmap__pin--off')
    expect(pins[1]!.attributes('title')).toBe('Recife / PE · 1 acesso(s) · offline (90d)')

    const legend = w.find('.tmap__legend').text()
    expect(legend).toContain('Online agora (5)')
    expect(legend).toContain('Acesso nos últimos 90 dias (4)')
    expect(w.find('.tmap__gap').exists()).toBe(false)
  })

  it('aplica calor nas UFs do SVG conforme dispositivos', async () => {
    const w = mount(TelemetryBrazilMap, {
      props: {
        points: [
          point({ city: 'Santos', region: 'SP', devices: 8, online: 2, is_online: true }),
          point({ city: 'Salvador', region: 'BA', devices: 1, online: 0, is_online: false }),
        ],
      },
    })
    await flushPromises()
    const host = w.find('.tmap__br').element as HTMLElement
    const sp = host.querySelector('#BR-SP') as SVGPathElement
    const ba = host.querySelector('#BR-BA') as SVGPathElement
    expect(sp.getAttribute('data-devices')).toBe('8')
    expect(ba.getAttribute('data-devices')).toBe('1')
    expect(sp.style.fill).not.toBe(ba.style.fill)
  })

  it('zoom revela labels de cidade e reset volta a 1×', async () => {
    const w = mount(TelemetryBrazilMap, {
      props: { points: [point({ city: 'Santos', region: 'SP' })] },
    })
    await flushPromises()
    expect(w.find('.tmap__label').exists()).toBe(false)
    await w.find('button[aria-label="Aproximar"]').trigger('click')
    await w.find('button[aria-label="Aproximar"]').trigger('click')
    await w.find('button[aria-label="Aproximar"]').trigger('click')
    expect(w.find('.tmap__label').exists()).toBe(true)
    expect(w.find('.tmap__label').text()).toBe('Santos')
    await w.find('button[aria-label="Resetar zoom"]').trigger('click')
    expect(w.find('.tmap__label').exists()).toBe(false)
    expect(w.find('.tmap__zoom-readout').text()).toBe('1.0×')
  })

  it('mostra gap quando liveOnline é maior que dispositivos no mapa', async () => {
    const w = mount(TelemetryBrazilMap, {
      props: {
        liveOnline: 17,
        points: [
          point({ city: 'Salvador', region: 'BA', devices: 2, online: 2, is_online: true }),
          point({ city: 'Santos', region: 'SP', devices: 1, online: 1, is_online: true }),
        ],
      },
    })
    await flushPromises()
    expect(w.find('.tmap__legend').text()).toContain('Online agora (3)')
    expect(w.find('.tmap__gap').text()).toContain(
      '14 online agora sem UF/Brasil no mapa (não dá para posicionar).',
    )
  })

  it('posiciona o marker em % conforme projectBrPoint (zoom 1×)', async () => {
    const w = mount(TelemetryBrazilMap, {
      props: { points: [point({ city: 'Santos', region: 'SP' })] },
    })
    await flushPromises()
    const pos = projectBrPoint('SP', 'Santos')!
    const style = w.find('.tmap__marker').attributes('style')!
    expect(style).toContain(`left: ${pos.left}%`)
    expect(style).toContain(`top: ${pos.top}%`)
  })

  it('ajusta viewBox do SVG ao aproximar (zoom vetorial)', async () => {
    const w = mount(TelemetryBrazilMap, {
      props: { points: [point({ city: 'Santos', region: 'SP' })] },
    })
    await flushPromises()
    const svg = () => (w.find('.tmap__br').element as HTMLElement).querySelector('svg')!
    expect(svg().getAttribute('viewBox')).toMatch(/^0 0 /)
    await w.find('button[aria-label="Aproximar"]').trigger('click')
    await w.find('button[aria-label="Aproximar"]').trigger('click')
    const vb = svg().getAttribute('viewBox')!
    const parts = vb.split(/\s+/).map(Number)
    expect(parts[2]!).toBeLessThan(612.51611)
    expect(parts[3]!).toBeLessThan(639.04297)
  })

  it('ignora pontos com UF desconhecida', async () => {
    const w = mount(TelemetryBrazilMap, {
      props: { points: [point({ region: 'XX' }), point({ region: '' })] },
    })
    await flushPromises()
    expect(w.findAll('button.tmap__pin')).toHaveLength(0)
    expect(w.find('.tmap__empty').exists()).toBe(true)
  })

  it('reage à atualização das props', async () => {
    const w = mount(TelemetryBrazilMap, { props: { points: [] } })
    await flushPromises()
    expect(w.findAll('button.tmap__pin')).toHaveLength(0)
    await w.setProps({ points: [point()] })
    await flushPromises()
    expect(w.findAll('button.tmap__pin')).toHaveLength(1)
    expect(w.find('.tmap__empty').exists()).toBe(false)
  })
})
