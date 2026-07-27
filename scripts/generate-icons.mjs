/**
 * Generates PWA icons from public/favicon.svg using sharp.
 * Run: node scripts/generate-icons.mjs
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svgPath = join(root, 'public', 'favicon.svg')
const svgBuffer = readFileSync(svgPath)

// favicon.svg is 64×64 with rx=16 rounded rect background #5A3C26.
// For maskable icons, add safe-zone padding (10% each side = icon centered in 80% area).

const sizes = [
  { name: 'icon-192.png', size: 192, maskable: false },
  { name: 'icon-512.png', size: 512, maskable: false },
  { name: 'icon-maskable-512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
]

for (const { name, size, maskable } of sizes) {
  const outPath = join(root, 'public', name)

  if (maskable) {
    // Maskable: fill background + center icon at 80% scale with safe zone
    const iconSize = Math.round(size * 0.8)
    const offset = Math.round(size * 0.1)
    const resizedIcon = await sharp(svgBuffer)
      .resize(iconSize, iconSize)
      .png()
      .toBuffer()

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 90, g: 60, b: 38, alpha: 1 }, // #5a3c26
      },
    })
      .composite([{ input: resizedIcon, top: offset, left: offset }])
      .png()
      .toFile(outPath)
  } else {
    await sharp(svgBuffer).resize(size, size).png().toFile(outPath)
  }

  console.log(`✓ ${name} (${size}×${size}${maskable ? ' maskable' : ''})`)
}

console.log('Done. Icons written to public/')
