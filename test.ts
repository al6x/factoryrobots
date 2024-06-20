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
  let p = calculateNewPosition({ x: 0, y: 0 }, ['N', 'E'])
  if (p.isError) throw new Error("shouldn't be an error")
  assertEqual(p.result, { x: 1, y: 1 })

  p = calculateNewPosition({ x: 0, y: 0 }, ['W'])
  assert(p.isError)
})

function buildRobot(position: Position){
  return new SimpleBot('1', position)
}