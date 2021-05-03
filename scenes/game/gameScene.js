import { Scene, Text, track, untrack, getCanvas, getPointer, emit, randInt, setStoreItem, getStoreItem } from 'kontra'
import { createBall } from './ball'
import { createPaddle } from './paddle'
import { createPill } from './pill'
import { createBlocks, blocks } from './blocks'
import { circleRect } from './collisions'
import { numLevels } from './config'

export function createGameScene(level = 0) {
  const carriedForwardScore = getStoreItem('breakoutScore') || 0
  const canvas = getCanvas()
  const pointer = getPointer()

  let pill = null

  let newLevelTimer
  let ball = createBall()
  let paddle = createPaddle()
  createBlocks(level)

  if (carriedForwardScore > 0) {
    paddle.holdingBall = true
  }

  let scoreUI = Text({
    value: carriedForwardScore,
    x: 10,
    y: 10,
    text: `Score: ${carriedForwardScore}`,
    color: 'white',
    font: '32px Bowlby One SC',
  })

  let scene = Scene({
    id: 'game',
    width: canvas.width,
    height: canvas.height,
    children: [blocks, paddle, scoreUI],
    pillActive: null,
    pillActiveTimer: null,
    onShow: function () {
      track(paddle)
      track(scene)
    },
    onHide: function () {
      untrack(paddle)
      untrack(scene)
      clearTimeout(newLevelTimer)
    },
    onDown: function () {
      if (Math.abs(pointer.x - paddle.x) < paddle.width) paddle.pointerDown = true
    },
    onUp: function () {
      paddle.pointerDown = false
      if (paddle.holdingBall === null) {
        paddle.holdingBall = true
      } else if (paddle.holdingBall) {
        paddle.holdingBall = false
      }
    },
    update: function () {
      this.advance()

      if (pill) {
        pill.update()
        // check collision of paddle and pill
        const collision = circleRect(pill, paddle)
        if (collision.collides) {
          pill = null
          this.pillActive = 'breakball'
          this.pillActiveTimer = 300
          ball.color = 'yellow'
          ball.accentColor = 'gold'
        }
        if (pill && pill.y > canvas.height) pill = null
      }

      if (this.pillActive) {
        this.pillActiveTimer -= 1
        if (this.pillActiveTimer <= 0) {
          this.pillActive = null
          this.pillActiveTimer = null
          ball.color = '#f0f0f1'
          ball.accentColor = '#d4d3d5'
        }
      }

      if (ball.ttl > 0) ball.update()

      // if ball is held follow paddle
      if (paddle.holdingBall === true) {
        ball.x = paddle.x
      } else if (paddle.holdingBall === false && ball.velocity.length() === 0) {
        ball.dy = -8
        ball.dx = 2
      }

      // check collision of paddle and ball
      const collision = circleRect(ball, paddle)
      if (collision.collides) {
        ball.position = collision.collisionPosition
        ball.velocity = collision.resolvedVelocity
      }

      // check collision of blocks, only destroy 1 brick per update
      let collisionsActive = true
      const aliveBlocks = blocks.getAliveObjects()
      aliveBlocks.forEach((block) => {
        const collision = circleRect(ball, block)
        if (collision.collides && collisionsActive) {
          collisionsActive = false
          block.ttl = 0
          if (this.pillActive !== 'breakball') {
            ball.position = collision.collisionPosition
            ball.velocity = collision.resolvedVelocity
          }
          scoreUI.value += 1
          scoreUI.text = 'Score: ' + scoreUI.value
          if (!pill && !this.pillActive && randInt(1, 5) === 1) pill = createPill(block.x, block.y)
        }
      })

      // if ball drop game over
      if (ball.y > canvas.height && ball.ttl > 0) {
        setStoreItem('breakoutScore', scoreUI.value)
        if (scoreUI.value > getStoreItem('breakoutHiscore')) {
          setStoreItem('breakoutHiscore', scoreUI.value)
        }
        emit('navigate', 'gameOver')
      }

      // start a new level when all blocks removed
      if (aliveBlocks.length === 0 && !newLevelTimer) {
        setStoreItem('breakoutScore', scoreUI.value)
        ball.ttl = 0
        newLevelTimer = setTimeout(() => {
          const newLevel = (level + 1) % numLevels
          emit('navigate', 'game', newLevel)
        }, 1000)
      }
    },
    render: function () {
      this.draw()

      // custom rendering here
      if (pill) pill.render()
      ball.render()
      blocks.render()
    },
  })

  return scene
}
