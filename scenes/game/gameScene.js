import { Scene, track, untrack, getCanvas, getPointer } from 'kontra'
import { createBall } from './ball'
import { createPaddle } from './paddle'
import { createBlocks, blocks } from './blocks'
import { circleRect } from './collisions'

export function createGameScene() {
  const canvas = getCanvas()
  const pointer = getPointer()

  let ball = createBall()
  let paddle = createPaddle()
  createBlocks()

  let scene = Scene({
    id: 'game',
    width: canvas.width,
    height: canvas.height,
    children: [ball, blocks, paddle],
    onShow: function () {
      track(paddle)
    },
    onHide: function () {
      untrack(paddle)
    },
    update: function () {
      this.advance()
      paddle.x = pointer.x

      const aliveBlocks = blocks.getAliveObjects()
      aliveBlocks.push(paddle)
      aliveBlocks.forEach((block) => {
        const collision = circleRect(ball, block)
        if (collision.collides) {
          block.ttl = 0
          ball.position = collision.collisionPosition
          ball.velocity = collision.resolvedVelocity
        }
      })
    },
    render: function () {
      this.draw()

      // custom rendering here
      blocks.render()
    },
  })

  return scene
}
