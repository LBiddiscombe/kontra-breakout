import { Sprite, getCanvas } from 'kontra'

function createBall() {
  const canvas = getCanvas()

  let ball = Sprite({
    x: canvas.width / 2,
    y: canvas.height - 140,
    radius: 8,
    speed: 8,
    anchor: { x: 0.5, y: 0.5 },
    color: '#f0f0f1',
    accentColor: '#d4d3d5',
    willBounce: true,
    update: function () {
      this.advance()
      if (this.x < this.radius) {
        this.dx *= -1
        this.x = this.radius + 1
      }
      if (this.x > canvas.width - this.radius) {
        this.dx *= -1
        this.x = canvas.width - this.radius - 1
      }
      if (this.y < this.radius) {
        this.dy *= -1
        this.y = this.radius + 1
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
