import { Text, Grid, Scene, getCanvas, emit, getStoreItem, setStoreItem, track, untrack } from 'kontra'

export function createMenuScene() {
  const canvas = getCanvas()

  let title = Text({
    text: document.title,
    x: canvas.width / 2,
    y: 50,
    color: '#4deeea',
    font: '48px Bowlby One SC',
    anchor: { x: 0.5, y: 0.5 },
  })

  let tapToStart = Text({
    text: 'Tap to Start',
    color: '#74ee15',
    font: '32px Bowlby One SC',
    anchor: { x: 0.5, y: 0.5 },
  })

  let instructions = Text({
    text: "It's Breakout, you know the deal",
    color: '#4deeea',
    font: '16px Bowlby One SC',
    anchor: { x: 0.5, y: 0.5 },
  })

  let lastScore = Text({
    text: 'Last Score',
    color: '#4deeea',
    font: '24px Bowlby One SC',
  })

  let hiScore = Text({
    text: 'Hi Score',
    color: '#ffe700',
    font: '24px Bowlby One SC',
  })

  let countdown = Text({
    text: '3',
    value: 3,
    color: '#74ee15',
    font: '64px Bowlby One SC',
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
      lastScore.text = `Last Score: ${getStoreItem('breakoutScore') || 0}`
      hiScore.text = `Hi-Score: ${getStoreItem('breakoutHiscore') || 0}`
    },
    onHide: function () {
      untrack(scene)
    },
    onUp: function () {
      menu.children = [tapToStart, instructions, countdown]
      setStoreItem('breakoutScore', undefined)
      emit('navigate', 'game', 0)
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
