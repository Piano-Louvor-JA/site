import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('favicon head integration', async () => {
  await setup({ rootDir: process.cwd(), setupTimeout: 360_000 })

  it('uses the PIANO app brand and modern fallback icons', async () => {
    const html = await $fetch('/')

    expect(html).toMatch(/<link[^>]+rel="icon"[^>]+href="\/brand\/piano-icon\.png"/)
    expect(html).toMatch(/<link[^>]+rel="icon"[^>]+href="\/favicon\.ico"[^>]+sizes="any"/)
    expect(html).toMatch(/<link[^>]+rel="apple-touch-icon"[^>]+href="\/apple-touch-icon\.png"/)
    expect(html).toMatch(/<link[^>]+rel="manifest"[^>]+href="\/manifest\.json"/)
    expect(html).not.toContain('/ico/')
  })
})
