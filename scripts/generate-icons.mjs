import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const root = process.cwd()
const source = path.join(root, 'public/brand/piano-icon.png')
const output = (...parts) => path.join(root, 'public', ...parts)
const background = '#0a1733'

const brand = await readFile(source)

async function logo(size) {
  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([
      {
        input: await sharp(brand)
          .resize({
            width: Math.floor(size * 0.7),
            height: Math.floor(size * 0.7),
            fit: 'contain',
          })
          .png()
          .toBuffer(),
        gravity: 'centre',
      },
    ])
    .png({ compressionLevel: 9, adaptiveFiltering: false })
    .toBuffer()
}

await mkdir(output(), { recursive: true })
const [icon16, icon32, icon48, icon180, icon192, icon512] = await Promise.all(
  [16, 32, 48, 180, 192, 512].map(logo),
)

await Promise.all([
  writeFile(output('apple-touch-icon.png'), icon180),
  writeFile(output('icon-192.png'), icon192),
  writeFile(output('icon-512.png'), icon512),
  writeFile(output('favicon.ico'), await pngToIco([icon16, icon32, icon48])),
  sharp({ create: { width: 1200, height: 630, channels: 4, background } })
    .composite([
      {
        input: await sharp(brand)
          .resize({ width: 320, height: 320, fit: 'contain' })
          .png()
          .toBuffer(),
        left: 120,
        top: 155,
      },
      {
        input: Buffer.from(
          `<svg width="600" height="160" xmlns="http://www.w3.org/2000/svg"><text x="0" y="90" font-family="Arial, sans-serif" font-size="66" font-weight="700" fill="#ffffff">PIANO LouvorJA</text><text x="2" y="140" font-family="Arial, sans-serif" font-size="30" fill="#00c1e6">Letras sincronizadas para projeção</text></svg>`,
        ),
        left: 510,
        top: 235,
      },
    ])
    .png({ compressionLevel: 9, adaptiveFiltering: false })
    .toFile(output('og-image.png')),
])
