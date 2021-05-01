import { Sprite, getCanvas } from 'kontra'

function createPaddle() {
  const canvas = getCanvas()

  let paddle = Sprite({
    x: canvas.width / 2,
    y: canvas.height - 80,
    width: 100,
    height: 30,
    anchor: { x: 0.5, y: 0.5 },
    color: 'white',
    deflectAngle: true,
    update: function () {
      this.advance()
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

      this.context.fillStyle = 'silver'
      this.context.beginPath()
      this.context.arc(x1, y1, radius1, startAngle1, endAngle1, antiClockwise1)
      this.context.lineTo(200, 0)
      this.context.arc(x2, y2, radius2, startAngle2, endAngle2, antiClockwise2)
      this.context.closePath()
      this.context.lineWidth = 4
      this.context.fill()

      // this.context.strokeStyle = 'red'
      // this.context.strokeRect(0, 0, this.width, this.height)
    },
  })

  return paddle
}

export { createPaddle }
