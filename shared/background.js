import { Sprite, Pool, getCanvas } from 'kontra'
import { generateHslColors, choose } from './helpers'

let blocks = Pool({
  create: Sprite,
  maxSize: 64,
})

const colors = generateHslColors(100, 60, 6)

function createBackground() {
  if (blocks.size) return blocks

  const canvas = getCanvas()
  let size

  for (let i = 0; i < blocks.maxSize; i++) {
    size = choose([32, 64, 128, 256])
    blocks.get({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: size,
      height: size / 2,
      anchor: { x: 0.5, y: 0.5 },
      color: `hsla(${choose(colors)}, 0.05)`,
    })
  }
  return blocks
}

export { createBackground }
