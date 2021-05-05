import { Pool, Sprite, getCanvas, randInt } from 'kontra'

let explodingBlocks = Pool({
  create: Sprite,
})

function explodeBlock(parentX, parentY, parentWidth = canvas.width / 9, parentHeight = 30, color = '#ffffffaa') {
  const canvas = getCanvas()
  const blockCount = 4
  const particleCount = 32

  for (let i = 0; i < blockCount; i++) {
    explodingBlocks.get({
      x: parentX + randInt(-parentWidth / 4, parentWidth / 4),
      y: parentY + randInt(-parentHeight / 4, parentHeight / 4),
      dx: Math.random() * 4 - Math.random() * 4,
      dy: -8,
      ddy: Math.random() + 0.5,
      ttl: 30,
      width: canvas.width / 18,
      height: 15,
      opacity: 0.5,
      anchor: { x: 0.5, y: 0.5 },
      color,
    })
  }

  for (let i = 0; i < particleCount; i++) {
    explodingBlocks.get({
      x: parentX + randInt(-parentWidth / 4, parentWidth / 4),
      y: parentY + randInt(-parentHeight / 4, parentHeight / 4),
      dx: Math.random() * 3 - Math.random() * 3,
      dy: -12,
      ddy: Math.random() + 1,
      ttl: 30,
      width: randInt(1, 3),
      height: randInt(1, 3),
      anchor: { x: 0.5, y: 0.5 },
      color: 'white',
    })
  }
}

export { explodeBlock, explodingBlocks }
