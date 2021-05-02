import { Sprite, getCanvas, getPointer } from 'kontra'

function createPaddle() {
  const canvas = getCanvas()
  const pointer = getPointer()

  let paddle = Sprite({
    x: canvas.width / 2,
    y: canvas.height - 120,
    width: 100,
    height: 30,
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
      var x1 = 10
      var y1 = 10
      var radius1 = 10
      var startAngle1 = Math.PI * 0.5
      var endAngle1 = Math.PI * 1.5
      var antiClockwise1 = false

      var x2 = 90
      var y2 = 10
      var radius2 = 10
      var startAngle2 = Math.PI * 1.5
      var endAngle2 = Math.PI * 0.5
      var antiClockwise2 = false

      this.context.fillStyle = 'yellow'
      this.context.beginPath()
      this.context.arc(x1, y1, radius1, startAngle1, endAngle1, antiClockwise1)
      this.context.lineTo(90, 0)
      this.context.arc(x2, y2, radius2, startAngle2, endAngle2, antiClockwise2)
      this.context.closePath()
      this.context.lineWidth = 4
      this.context.fill()
    },
  })

  return paddle
}

export { createPaddle }
