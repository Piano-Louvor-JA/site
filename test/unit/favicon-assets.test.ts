import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const asset = (...parts: string[]) => path.join(root, 'public', ...parts)

async function pngSize(filename: string) {
  const bytes = await readFile(filename)
  expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
}

describe('favicon assets', () => {
  it('keeps the official PIANO app icon source', async () => {
    await expect(stat(asset('brand/piano-icon.png'))).resolves.toBeDefined()
  })

  it('ships a three-image ICO fallback', async () => {
    const bytes = await readFile(asset('favicon.ico'))
    expect(bytes.subarray(0, 4).toString('hex')).toBe('00000100')
    expect(bytes.readUInt16LE(4)).toBeGreaterThanOrEqual(3)
  })

  it.each([
    ['apple-touch-icon.png', 180],
    ['icon-192.png', 192],
    ['icon-512.png', 512],
  ])('creates %s with expected square dimensions', async (filename, size) => {
    await expect(pngSize(asset(filename))).resolves.toEqual({ width: size, height: size })
  })

  it('creates a social preview with exact dimensions', async () => {
    await expect(pngSize(asset('og-image.png'))).resolves.toEqual({ width: 1200, height: 630 })
  })

  it('keeps icon payloads compact', async () => {
    const icons = await Promise.all(
      ['favicon.ico', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'].map((file) =>
        stat(asset(file)),
      ),
    )
    expect(icons.reduce((total, file) => total + file.size, 0)).toBeLessThanOrEqual(150_000)
    const ogImage = await stat(asset('og-image.png'))
    expect(ogImage.size).toBeLessThanOrEqual(300_000)
  })
})
