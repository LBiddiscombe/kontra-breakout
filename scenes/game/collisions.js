import { Vector, getContext, clamp } from 'kontra'

const edgeNormals = {
  top: Vector(0, -1),
  bottom: Vector(0, 1),
  left: Vector(-1, 0),
  right: Vector(1, 0),
}

/*
  See https://learnopengl.com/In-Practice/2D-Game/Collisions/Collision-detection
  Assumes both circle and rec positions are midpoints
  1. Check for collision
  2. Calculate overlap, save collision position
  3. Get resolution direction using collision position (not current)
  Return {collides: bool, collisionPosition: Vector, resolvedVelocity: Vector}
*/
function circleRect(circle, rect) {
  let collides = false
  let collisionPosition = circle.position
  let resolvedVelocity = Vector(0, 0)
  let isTop = false

  let edge = null
  const rectHalf = Vector(rect.width / 2, rect.height / 2)
  let difference = circle.position.subtract(rect.position)
  const clamped = Vector(clamp(-rectHalf.x, rectHalf.x, difference.x), clamp(-rectHalf.y, rectHalf.y, difference.y))
  const closest = rect.position.add(clamped)
  difference = closest.subtract(circle.position)

  collides = difference.length() < circle.radius

  if (!collides) return { collides: false, collisionPosition, resolvedVelocity }

  // calculate collisionPosition
  const collisionDirection = circle.velocity.normalize()
  const overlap = circle.radius - difference.length() + 1
  collisionPosition = circle.position.subtract(collisionDirection.scale(overlap))

  // which face was collided - use dot product of difference and block faces normal vector - lowest negative is the face hit
  //if (difference.length === 0) difference = collisionDirection

  let bestMatch = Infinity
  for (const prop in edgeNormals) {
    if (difference.dot(edgeNormals[prop]) < bestMatch) {
      bestMatch = difference.dot(edgeNormals[prop])
      edge = edgeNormals[prop]
      isTop = prop === 'top'
    }
  }

  // add some deflection angles just for the paddle
  //top: Vector(0, -1) in middle, (-0.196, -0.981) on left, (0.196, -0.981) on right
  if (isTop && rect.deflectAngle) {
    const currentAngle = vectorAngle(circle.velocity)
    if (closest.x <= rect.x - rect.width / 3 && currentAngle < 135) edge = Vector(-0.196, -0.981)
    if (closest.x >= rect.x + rect.width / 3 && currentAngle > 45) edge = Vector(0.196, -0.981)
  }

  resolvedVelocity = vectorReflect(circle, edge)

  return { collides, collisionPosition, resolvedVelocity }
}

function vectorReflect(obj, solid) {
  const dotProduct = obj.velocity.dot(solid)
  return Vector(obj.dx - 2 * solid.x * dotProduct, obj.dy - 2 * solid.y * dotProduct)
}

function vectorAngle(dir) {
  var angle = Math.atan2(dir.y, dir.x)
  var degrees = (180 * angle) / Math.PI
  return (360 + Math.round(degrees)) % 360
}

export { circleRect }
