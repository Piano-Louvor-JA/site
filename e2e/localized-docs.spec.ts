import { test, expect } from '@playwright/test'

test('localized article keeps its source and sidebar links after hydration', async ({ page }) => {
  await page.route('https://**', (route) => route.abort())
  await page.goto('/uk/docs/install/windows')
  await page.waitForFunction(() =>
    Object.hasOwn(document.querySelector('#__nuxt') ?? {}, '__vue_app__'),
  )
  await expect(page.locator('.doc-footer__edit')).toHaveAttribute(
    'href',
    'https://github.com/Piano-Louvor-JA/site/blob/main/content/docs/uk/install/windows.md',
  )
  await expect(page.locator('a[href*="/docs/docs/"]')).toHaveCount(0)
  await expect(page.locator('.doc-fallback-note')).toHaveCount(0)
})
