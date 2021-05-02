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
      let shadowPath = new Path2D(
        'm 90 5 c 5.5 0 10 4.5 10 10 c 0 2 0 -2 0 0 c 0 5.5 -4.5 10 -10 10 c -18 0 -62 0 -80 0 c -5.5 0 -10 -4.5 -10 -10 c 0 -2 0 2 0 0 c 0 -5.5 4.5 -10 10 -10 c 18 0 62 0 80 0 z'
      )
      let path = new Path2D(
        'm 90 0 c 5.5 0 10 4.5 10 10 c 0 2 0 -2 0 0 c 0 5.5 -4.5 10 -10 10 c -18 0 -62 0 -80 0 c -5.5 0 -10 -4.5 -10 -10 c 0 -2 0 2 0 0 c 0 -5.5 4.5 -10 10 -10 c 18 0 62 0 80 0 z'
      )

      this.context.fillStyle = 'lightgrey'
      this.context.fill(shadowPath)
      this.context.fillStyle = 'white'
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
