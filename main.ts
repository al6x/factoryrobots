import { Command, Controller, Factory, Position, Robot } from './api.js'
import { Log, Result, assert, assertEqual, isEqual, log, sleep } from './helper.js'

export function calculateNewPosition({ x, y }: Position, commands: Command[]): Result<Position> {
  const p = { x, y }
  for (const c of commands) {
    switch (c) {
      case 'N': p.y++; break
      case 'E': p.x++; break
      case 'S': p.y--; break
      case 'W': p.x--; break
    }
  }
  // In this simple implementation, we don't check for collisions with other robots.
  if (p.x < 0 || p.x > 9 || p.y < 0 || p.y > 9) return { isError: true, error: 'Collision with the wall' }
  return { isError: false, result: p }
}

export class SimpleBot implements Robot {
  private readonly log: Log
  private stopped = false

  constructor(readonly id: string, private position: Position = { x: 0, y: 0 }) {
    this.log = log('Robot', id)
    this.log('started')
  }

  async getPosition(): Promise<Position> {
    // Strictly speaking, if robot currently moving, we should wait for it to stop,
    // but for simplicity ignoring.
    return this.position
  }

  async ping(): Promise<void> {
    this.log(`ping, current position: ${JSON.stringify(this.position)}`)
  }

  async do(...commands: Command[]): Promise<void> {
    if (this.stopped) throw new Error('Robot is stopped')
    const p = calculateNewPosition(this.position, commands)
    if (p.isError) throw new Error(p.error)
    if (isEqual(this.position, p.result)) return
    this.log(`moving ${JSON.stringify(this.position)} - ${JSON.stringify(commands)} -> ${JSON.stringify(p.result)}`)
    this.position = p.result
  }

  async stop(): Promise<void> {
    this.stopped = true
    this.log('stopped')
  }
}

export function moveTo00({ x, y }: Position): Command[] {
  const commands: Command[] = []
  while (x > 0) { commands.push('W'); x-- }
  while (y > 0) { commands.push('S'); y-- }
  return commands
}

export class Skynet implements Controller {
  private readonly log = log('Skynet')

  constructor(private readonly robots: Robot[]) {
    this.log('started')
  }

  async moveTo00(r: Robot): Promise<void> {
    let current = await r.getPosition()
    const commands = moveTo00(current)
    if (commands.length == 0) return
    this.log(`moving ${r.id} to 0,0`)
    await r.do(...commands)
    assertEqual(await r.getPosition(), { x: 0, y: 0 }, 'Robot should be at 0,0')
  }

  async run(factories: Factory[]): Promise<void> {
    this.log('running')

    // For simplicity, just moving single robot to the middle
    assert(factories.length >= 1, 'At least one factory is required')
    const factory = factories[0]
    assertEqual(factory.robots.length, 1, 'Exactly one robot required, robot collisions not handled')
    const robot = factory.robots[0]

    await this.moveTo00(robot)
    while (true) {
      this.log(`moving robot ${robot.id} in factory ${factory.id} to center`)
      // Go to center
      await robot.do('N', 'E', 'N', 'E', 'N', 'E', 'N', 'E')
      assertEqual(await robot.getPosition(), { x: 4, y: 4 }, 'Robot should be at 4,4')
      await robot.ping()

      await sleep(2000)
      // Go back to 0,0
      await this.moveTo00(robot)
      await sleep(2000)
      await robot.ping()
    }
  }
}

declare var process: any
if (process.argv[1] === ('' + import.meta.url).replace('file://', '')) {
  const robot = new SimpleBot('F1/R1')
  const skynet = new Skynet([robot])
  skynet.run([{ id: 'F1', robots: [robot] }])
    .catch(console.error)
}