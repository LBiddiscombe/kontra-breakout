import { Sprite, Text } from 'kontra'
import { choose } from '../../shared/helpers'

function createPill(x, y) {
  const types = [
    {
      name: 'SlowerBall',
      label: 'SB',
      color: '#B1B7BF',
      timeLimit: 300,
    },
    {
      name: 'FasterBall',
      label: 'FB',
      color: '#D42434',
      timeLimit: 300,
    },
    {
      name: 'BreakBall',
      label: 'BB',
      color: 'gold',
      timeLimit: 300,
    },
    {
      name: 'StickyPaddle',
      label: 'ST',
      color: 'limegreen',
      timeLimit: 600,
    },
    {
      name: 'LaserPaddle',
      label: 'LP',
      color: 'tomato',
      timeLimit: 180,
    },
    {
      name: 'ExpandPaddle',
      label: 'EP',
      color: '#B1D9EF',
      timeLimit: 600,
    },
    {
      name: 'ShrinkPaddle',
      label: 'SP',
      color: '#DC644C',
      timeLimit: 600,
    },
  ]

  let type = choose(types)

  let label = Text({
    text: type.label,
    color: 'black',
    font: 'Bold 14px sans-serif',
    anchor: { x: 0.5, y: 0.7 },
  })

  let pill = Sprite({
    x,
    y,
    dy: 4,
    radius: 14,
    width: 30,
    height: 30,
    anchor: { x: 0.5, y: 0.5 },
    color: type.color,
    type,
    children: [label],
  })

  return pill
}

export { createPill }
