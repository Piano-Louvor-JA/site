import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('Documentation detail routing', async () => {
  await setup({ rootDir: process.cwd() })

  it('renders the Windows installation article rather than the docs index parent', async () => {
    const html = await $fetch<string>('/docs/install/windows')
    expect(html).toContain('TechArticle')
    expect(html).not.toContain('Doc not found')
  })
})
