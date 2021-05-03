import './style.css'
import { init, initPointer, on, GameLoop } from 'kontra'
import { createBackground } from './shared/background'
import { createBootScene } from './scenes/bootScene'
import { createMenuScene } from './scenes/menuScene'
import { createGameScene } from './scenes/game/gameScene'
import { createGameOverScene } from './scenes/gameOverScene'

const { canvas } = init()
// canvas.width = Math.min(window.innerWidth, 768)
// canvas.height = window.innerHeight

const background = createBackground()

initPointer()

const bootScene = createBootScene()
let currentScene = bootScene
currentScene.show()

on('navigate', (name, level = null) => {
  currentScene.hide()
  currentScene.destroy()

  switch (name) {
    case 'menu':
      currentScene = createMenuScene()
      break
    case 'game':
      currentScene = createGameScene(level)
      break
    case 'gameOver':
      currentScene = createGameOverScene()
      break
  }

  currentScene.show()
})

let loop = GameLoop({
  update: function () {
    currentScene.update()
  },
  render: function () {
    background.render()
    currentScene.render()
  },
})

loop.start()
