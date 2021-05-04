import { Sprite, getCanvas, getPointer } from 'kontra'

function createPaddle() {
  const canvas = getCanvas()
  const pointer = getPointer()

  let paddle = Sprite({
    x: canvas.width / 2,
    y: canvas.height - 120,
    width: 100,
    height: 20,
    anchor: { x: 0.5, y: 0.5 },
    color: 'white',
    accentColor: 'lightgrey',
    deflectAngle: true,
    pointerDown: false,
    holdingBall: null,
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
    },
    render: function () {
      let shadowPath = new Path2D(
        'm 100 20 c 0 -8 -7 -20 -15 -20 l -70 0 c -8 0 -15 8 -15 20 c 0 9 12 0 20 0 l 60 0 c 8 0 20 9 20 0 z'
      )
      let path = new Path2D(
        'm 100 16 c 0 -8 -7 -16 -15 -16 l -70 0 c -8 0 -15 8 -15 16 c 0 9 12 0 20 0 l 60 0 c 8 0 20 9 20 0 z'
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
