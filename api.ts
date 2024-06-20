export type Command = 'N' | 'E' | 'S' | 'W'
export type Position = { x: number, y: number }

/** Robot may have different implementations.
 *  Robots are far away, communication takes time, so API is async.
 */
export interface Robot {
  readonly id: string
  getPosition(): Promise<Position>
  do(...commands: Command[]): Promise<void>
  ping(): Promise<void>
  /** Factory robots are dangerous, there should be a way to stop it in emergency */
  stop(): Promise<void>
}

export interface Factory {
  readonly id: string
  readonly robots: Robot[]
}

/** Controls many Robots in many Factories, may have different implementations */
export interface Controller {
  run(factories: Factory[]): Promise<void>
}