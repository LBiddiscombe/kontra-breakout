import { Sprite, getCanvas, getPointer, lerp } from 'kontra'

function createPaddle() {
  const canvas = getCanvas()
  const pointer = getPointer()

  let paddle = Sprite({
    x: canvas.width / 2,
    y: canvas.height - 120,
    targetWidth: 90,
    width: 90,
    height: 20,
    anchor: { x: 0.5, y: 0.5 },
    color: 'white',
    accentColor: 'lightgrey',
    deflectAngle: true,
    pointerDown: false,
    holdingBall: true,
    heldBallOffsetX: 0,
    sticky: false,
    update: function () {
      this.advance()
    },
    onDown: function () {
      this.pointerDown = true
    },
    onUp: function () {
      this.pointerDown = false
      if (this.holdingBall) {
        this.holdingBall = false
      }
    },
    update: function () {
      if (this.pointerDown) {
        paddle.x = pointer.x
      }

      if (this.width !== this.targetWidth) {
        if (Math.abs(this.targetWidth - this.width) > 1) {
          this.width = lerp(this.width, this.targetWidth, 0.1)
        } else {
          this.width = this.targetWidth
        }
      }
    },
    render: function () {
      let shadowPath = new Path2D(
        `m ${this.width} 20 c 0 -8 -7 -20 -15 -20 l -${this.width - 30} 0 c -8 0 -15 8 -15 20 c 0 9 12 0 20 0 l ${
          this.width - 40
        } 0 c 8 0 20 9 20 0 z`
      )
      let path = new Path2D(
        `m ${this.width} 16 c 0 -8 -7 -16 -15 -16 l -${this.width - 30} 0 c -8 0 -15 8 -15 16 c 0 9 12 0 20 0 l ${
          this.width - 40
        } 0 c 8 0 20 9 20 0 z`
      )

      this.context.fillStyle = this.accentColor
      this.context.fill(shadowPath)
      this.context.fillStyle = this.color
      this.context.fill(path)

      // debug hitbox
      // this.context.strokeStyle = 'red'
      // this.context.lineWidth = 2
      // this.context.strokeRect(0, 0, this.width, this.height)
    },
  })

  return paddle
}

export { createPaddle }
