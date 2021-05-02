import { Text, Grid, Scene, getCanvas, emit, getStoreItem } from 'kontra'

export function createGameOverScene() {
  const canvas = getCanvas()
  let timer

  let lose = Text({
    text: 'Game Over',
    color: '#ff073a',
    font: 'Bold 48px Comfortaa',
    render: function () {
      this.context.shadowBlur = 12
      this.context.shadowColor = this.color
      this.draw()
    },
  })

  let score = Text({
    text: '',
    color: '#4deeea',
    font: 'bold 48px Comfortaa',
    render: function () {
      this.context.shadowBlur = 12
      this.context.shadowColor = this.color
      this.draw()
    },
  })

  let hiscore = Text({
    text: '',
    color: '#ffe700',
    font: '24px Comfortaa',
    render: function () {
      this.context.shadowBlur = 6
      this.context.shadowColor = this.color
      this.draw()
    },
  })

  let loseGrid = Grid({
    x: canvas.width / 2,
    y: canvas.height / 3,
    anchor: { x: 0.5, y: 0.5 },
    rowGap: 64,
    justify: 'center',
    children: [lose, score, hiscore],
  })

  return Scene({
    id: 'gameOver',
    children: [loseGrid],
    onHide: function () {
      clearTimeout(timer)
    },
    onShow: function () {
      score.text = `Score: ${getStoreItem('breakoutScore') || 0}`
      hiscore.text = `Hi-Score: ${getStoreItem('breakoutHiscore') || 0}`
      timer = setTimeout(() => {
        emit('navigate', 'menu')
      }, 2000)
    },
  })
}
