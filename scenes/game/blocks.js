import { Pool, Sprite, getCanvas } from 'kontra'
import { generateHslColors } from '../../shared/helpers'

let blocks = Pool({
  create: Sprite,
})

function createBlocks() {
  const canvas = getCanvas()
  const cols = 8
  const rows = 6
  const width = canvas.width / 9
  const height = 30
  const padding = 4
  const offsetX = (canvas.width - (cols - 1) * (width + padding)) / 2
  const offsetY = canvas.height / 7

  const colors = generateHslColors(100, 60, rows)

  console.log(colors)

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      blocks.get({
        x: j * (width + padding) + offsetX,
        y: i * (height + padding) + offsetY,
        width,
        height,
        anchor: { x: 0.5, y: 0.5 },
        deflectAngle: false,
        color: `hsla(${colors[i]})`,
      })
    }
  }
}

export { createBlocks, blocks }
