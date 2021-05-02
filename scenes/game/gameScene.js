import { Scene, track, untrack, getCanvas } from 'kontra'
import { createBall } from './ball'
import { createPaddle } from './paddle'
import { createBlocks, blocks } from './blocks'
import { circleRect } from './collisions'

export function createGameScene() {
  const canvas = getCanvas()

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
      track(scene)
    },
    onHide: function () {
      untrack(paddle)
      untrack(scene)
    },
    onUp: function () {
      paddle.pointerDown = false
    },
    update: function () {
      this.advance()
      // check collision of paddle
      const collision = circleRect(ball, paddle)
      if (collision.collides) {
        ball.position = collision.collisionPosition
        ball.velocity = collision.resolvedVelocity
      }

      const aliveBlocks = blocks.getAliveObjects()
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
