import {
  Scene,
  Text,
  Vector,
  track,
  untrack,
  getCanvas,
  getPointer,
  emit,
  on,
  off,
  randInt,
  setStoreItem,
  getStoreItem,
} from 'kontra'
import { createBall } from './ball'
import { createPaddle } from './paddle'
import { createPill } from './pill'
import { createLaser, lasers } from './laser'
import { createBlocks, blocks } from './blocks'
import { explodeBlock, explodingBlocks } from './explodingBlock'
import { circleRect } from './collisions'
import { numLevels } from './config'

export function createGameScene(level = 0) {
  const carriedForwardScore = getStoreItem('breakoutScore') || 0
  const canvas = getCanvas()
  const pointer = getPointer()
  const powerUpOdds = 5 //1 in 'this' blocks will spawn a powerup pill

  let pill = null
  let newLevelTimer
  let ball = createBall()
  let paddle = createPaddle()
  createBlocks(level)
  lasers.clear()

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
    children: [blocks, paddle, scoreUI, lasers, explodingBlocks],
    powerUpActive: null,
    powerUpCountdown: null,
    frameCounter: 0,
    onShow: function () {
      track(paddle)
      track(scene)
      on('powerUpOn', (type) => {
        this.powerUpActive = type
        this.powerUpCountdown = type.timeLimit
        pill = null
        switch (true) {
          case type.name === 'BreakBall':
            ball.color = 'yellow'
            ball.accentColor = 'gold'
            ball.willBounce = false
            break
          case type.name === 'SlowerBall':
            ball.targetSpeed = Math.max((ball.speed - 4).toFixed(1), 4)
            break
          case type.name === 'FasterBall':
            ball.targetSpeed = Math.min((ball.speed + 4).toFixed(1), 16)
            break
          case type.name === 'StickyPaddle':
            paddle.color = 'limegreen'
            paddle.accentColor = 'forestgreen'
            paddle.sticky = true
            break
          case type.name === 'LaserPaddle':
            paddle.color = 'tomato'
            paddle.accentColor = 'firebrick'
            lasers.clear()
            break
          case type.name === 'ExpandPaddle':
            paddle.color = type.color
            paddle.accentColor = '#5F97BD'
            paddle.targetWidth = 120
            break
          case type.name === 'ShrinkPaddle':
            paddle.color = type.color
            paddle.accentColor = '#C05046'
            paddle.targetWidth = 60
            break
        }
      })
      on('powerUpOff', (type) => {
        this.powerUpActive = null
        this.powerUpCountdown = null
        ball.color = '#f0f0f1'
        ball.accentColor = '#d4d3d5'
        ball.willBounce = true
        paddle.color = 'white'
        paddle.accentColor = 'lightgrey'
        paddle.sticky = false
        paddle.targetWidth = 90
        if (type.name === 'FasterBall') ball.targetSpeed = Math.max((ball.speed - 4).toFixed(1), 10)
        if (type.name === 'SlowerBall') ball.targetSpeed = Math.min((ball.speed + 4).toFixed(1), 10)
      })
    },
    onHide: function () {
      untrack(paddle)
      untrack(scene)
      clearTimeout(newLevelTimer)
      off('powerUpOn')
      off('powerUpOff')
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

      this.frameCounter += 1

      // increase ball speed over time
      if (this.frameCounter % 120 === 0 && paddle.holdingBall === false && paddle.speed === paddle.targetSpeed) {
        ball.targetSpeed = Math.min((ball.speed + 0.2).toFixed(1), 16)
        ball.speed = Math.min((ball.speed + 0.2).toFixed(1), 16)
      }

      if (pill) {
        pill.update()
        // check collision of paddle and pill
        const collision = circleRect(pill, paddle)
        if (collision.collides) {
          emit('powerUpOn', pill.type)
        }
        if (pill && pill.y > canvas.height) pill = null
      }

      if (this.powerUpActive) {
        if (this.powerUpActive.name === 'LaserPaddle' && this.powerUpCountdown % 10 === 0) {
          createLaser(paddle.x, paddle.y - 20)
        }

        this.powerUpCountdown -= 1
        if (this.powerUpCountdown <= 0) {
          emit('powerUpOff', this.powerUpActive)
        }
      }

      if (ball.ttl > 0) ball.update()

      // if ball is held follow paddle
      if (paddle.holdingBall === true) {
        ball.x = paddle.x + paddle.heldBallOffsetX
        ball.y = paddle.y - 20
      } else if (paddle.holdingBall === false && ball.velocity.length() === 0) {
        ball.velocity = Vector(0.196, -0.981).scale(ball.speed)
      }

      // check collision of paddle and ball
      const collision = circleRect(ball, paddle)
      if (collision.collides) {
        ball.position = collision.collisionPosition
        ball.velocity = collision.resolvedVelocity
        if (paddle.sticky) {
          paddle.holdingBall = true
          paddle.heldBallOffsetX = ball.x - paddle.x
          switch (true) {
            case paddle.heldBallOffsetX <= -15:
              ball.velocity = Vector(-0.196, -0.981).scale(ball.speed)
              break
            case paddle.heldBallOffsetX >= 15:
              ball.velocity = Vector(0.196, -0.981).scale(ball.speed)
              break
            default:
              ball.velocity = Vector(0, -1).scale(ball.speed)
          }
        }
      }

      // check collision of blocks, only destroy 1 brick per update
      let collisionsActive = true
      const aliveBlocks = blocks.getAliveObjects()
      aliveBlocks.forEach((block) => {
        const aliveLasers = lasers.getAliveObjects()
        aliveLasers.forEach((laser) => {
          const collision = circleRect(laser, block)
          if (collision.collides) {
            block.ttl = 0
            explodeBlock(block.x, block.y, block.width, block.height, block.color)
            laser.ttl = 0
            scoreUI.value += 1
            scoreUI.text = 'Score: ' + scoreUI.value
          }
        })

        const collision = circleRect(ball, block)
        if (collision.collides && collisionsActive) {
          collisionsActive = false
          block.ttl = 0
          explodeBlock(block.x, block.y, block.width, block.height, block.color)
          if (ball.willBounce) {
            ball.position = collision.collisionPosition
            ball.velocity = collision.resolvedVelocity
          }
          scoreUI.value += 1
          scoreUI.text = 'Score: ' + scoreUI.value
          if (!pill && !this.powerUpActive && randInt(1, powerUpOdds) === 1) pill = createPill(block.x, block.y)
        }
      })

      // if ball drops to bottom game over
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
        pill = null
        lasers.clear()
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
      lasers.render()
      explodingBlocks.render()
    },
  })

  return scene
}
