import { Text, Grid, Vector, Scene, getCanvas, emit, getStoreItem, track, untrack } from 'kontra'

export function createMenuScene() {
  const canvas = getCanvas()

  let title = Text({
    text: document.title,
    x: canvas.width / 2,
    y: 50,
    color: '#4deeea',
    font: 'Bold 48px Comfortaa',
    anchor: { x: 0.5, y: 0.5 },
    render: function () {
      this.context.shadowBlur = 12
      this.context.shadowColor = this.color
      this.draw()
    },
  })

  let tapToStart = Text({
    text: 'Tap to Start',
    color: '#74ee15',
    font: 'Bold 32px Comfortaa',
    anchor: { x: 0.5, y: 0.5 },
    render: function () {
      this.context.shadowBlur = 8
      this.context.shadowColor = this.color
      this.draw()
    },
  })

  let instructions = Text({
    text: "It's Breakout, you know the deal.",
    color: '#4deeea',
    font: 'Bold 16px Comfortaa',
    anchor: { x: 0.5, y: 0.5 },
    render: function () {
      this.context.shadowBlur = 4
      this.context.shadowColor = this.color
      this.draw()
    },
  })

  let lastScore = Text({
    text: 'Last Score',
    color: '#4deeea',
    font: '24px Comfortaa',
    render: function () {
      this.context.shadowBlur = 6
      this.context.shadowColor = this.color
      this.draw()
    },
  })

  let hiScore = Text({
    text: 'Hi Score',
    color: '#ffe700',
    font: '24px Comfortaa',
    render: function () {
      this.context.shadowBlur = 6
      this.context.shadowColor = this.color
      this.draw()
    },
  })

  let countdown = Text({
    text: '3',
    value: 3,
    color: '#74ee15',
    font: '64px Comfortaa',
    render: function () {
      this.context.shadowBlur = 16
      this.context.shadowColor = this.color
      this.draw()
    },
  })

  let menu = Grid({
    x: canvas.width / 2,
    y: canvas.height / 3,
    anchor: { x: 0.5, y: 0.5 },
    rowGap: [16, 64],
    justify: 'center',
    children: [tapToStart, instructions, lastScore, hiScore],
  })

  const scene = Scene({
    id: 'menu',
    width: canvas.width,
    height: canvas.height,
    children: [title, menu],
    onShow: function () {
      lastScore.text = `Last Score: ${getStoreItem('score') || 0}`
      hiScore.text = `Hi-Score: ${getStoreItem('hiscore') || 0}`
    },
    onHide: function () {
      untrack(scene)
    },
    onDown: function () {
      menu.children = [tapToStart, instructions, countdown]

      emit('navigate', 'game')
      // const timer = setInterval(() => {
      //   countdown.value -= 1
      //   if (countdown.value <= 0) {
      //     clearInterval(timer)
      //     emit('navigate', 'game')
      //   }
      //   countdown.text = `${countdown.value}`
      // }, 1000)
    },
  })

  track(scene)

  return scene
}
