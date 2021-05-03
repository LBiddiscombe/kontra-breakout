import { Sprite, getCanvas } from 'kontra'

function createBall() {
  const canvas = getCanvas()

  let ball = Sprite({
    x: canvas.width / 2,
    y: canvas.height - 140,
    radius: 8,
    anchor: { x: 0.5, y: 0.5 },
    color: '#f0f0f1',
    accentColor: '#d4d3d5',
    update: function () {
      this.advance()
      if (ball.x < this.radius || ball.x > canvas.width - this.radius) {
        ball.dx *= -1
        ball.x += ball.dx
      }
      if (ball.y < this.radius) {
        ball.dy *= -1
        ball.y += ball.dy
      }
    },
    render: function () {
      this.context.beginPath()
      this.context.fillStyle = this.accentColor
      this.context.arc(0, 0, this.radius, 0, Math.PI * 2)
      this.context.fill()

      this.context.beginPath()
      this.context.fillStyle = this.color
      this.context.arc(-1, -2, this.radius - 2, 0, Math.PI * 2)
      this.context.fill()
    },
  })

  return ball
}

export { createBall }
