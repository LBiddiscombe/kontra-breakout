import { Sprite, Pool } from 'kontra'

let lasers = Pool({
  create: Sprite,
})

function createLaser(x, y) {
  lasers.get({
    x,
    y,
    dy: -10,
    width: 4,
    height: 8,
    radius: 4,
    anchor: { x: 0.5, y: 0.5 },
    color: 'tomato',
    ttl: 180,
  })
}

export { createLaser, lasers }
