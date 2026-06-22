export class PatternMismatchError extends Error {
  constructor(value: unknown) {
    super(`pattern matching error: no pattern matches value ${String(value)}`)
  }
}
