import { Position } from './api.js'
import { assert, assertEqual, disableLog, test } from './helper.js'
import { SimpleBot, calculateNewPosition } from './main.js'

disableLog()

test('robot can move', async () => {
  const r = buildRobot({ x: 0, y: 0 })
  await r.do('N')
  assertEqual(await r.getPosition(), { x: 0, y: 1 })
})

test("robot doesn't hit the wall", async () => {
  const r = buildRobot({ x: 0, y: 0 }); let failed = false
  try { await r.do('W') }
  catch (e) { failed = true }
  assert(failed)
  assertEqual(await r.getPosition(), { x: 0, y: 0 })
})

test("calculate new position", () => {
  assertEqual(calculateNewPosition({ x: 0, y: 0 }, ['N', 'E']), { isError: false, result: { x: 1, y: 1 } })
  assertEqual(calculateNewPosition({ x: 0, y: 0 }, ['W']), { isError: true, error: 'Collision with the wall' })
})

function buildRobot(position: Position){
  return new SimpleBot('1', position)
}