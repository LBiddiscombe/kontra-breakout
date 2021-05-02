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
    deflectAngle: true,
    pointerDown: false,
    holdingBall: null,
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
      let p = new Path2D(
        'M90 0C95.52 0 100 4.48 100 10C100 12 100 8 100 10C100 15.52 95.52 20 90 20C72 20 28 20 10 20C4.48 20 0 15.52 0 10C0 8 0 12 0 10C0 4.48 4.48 0 10 0C28 0 72 0 90 0Z'
      )
      this.context.fillStyle = 'white'
      this.context.fill(p)

      // // debug hitbox
      // this.context.strokeStyle = 'red'
      // this.context.lineWidth = 2
      // this.context.strokeRect(0, 0, this.width, this.height)
    },
  })

  return paddle
}

export { createPaddle }
