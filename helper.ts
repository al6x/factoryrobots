export async function test(tname: string, fn: (() => void) | (() => Promise<void>)) {
  try {
    await fn(); // Await the function execution to handle both sync and async cases
    console.log(`test ${tname}: ok`);
  } catch (e) {
    console.error(`test ${tname}: fail`);
    console.error(e);
  }
}

export function assert(cond: boolean, message = 'Assertion failed'): void {
  if (cond !== true) throw new Error(message)
}
export function assertEqual<T>(a: T, b: T, message = 'Assertion failed, a != b'): void {
  if (!isEqual(a, b)) throw new Error(message)
}

export function isEqual<T>(a: T, b: T): boolean {
  return JSON.stringify(a) == JSON.stringify(b)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export type Result<T> = { isError: false, result: T } | { isError: true, error: string }

export type Log = (message: string) => void

let logDisabled = false
export function disableLog() { logDisabled = true }

export function log(component: string, id = ''): Log {
  component = component.padEnd(6, ' ').slice(0, 6)
  id = id.padEnd(4, ' ').slice(0, 4)
  return (message: string) => {
    if (!logDisabled) console.log(`${component} ${id}: ${message}`)
  }
}