import type { MatchableValue, MatchObjectCases } from './types'
import { PatternMismatchError } from './errors'

/**
 * typesafe exhaustive matching for discriminated unions and objects
 *
 * @throws {PatternMismatchError} if no pattern matches the value
 */
export function match<V extends PropertyKey, C>(
  value: V,
  cases: C & {
    [K in keyof C]: C[K] extends () => unknown ? unknown : never;
  } & ('_' extends keyof C
    ? Record<Exclude<keyof C, V | '_'>, never>
    : Record<Exclude<keyof C, V>, never>
      & Record<Exclude<V, keyof C>, never>),
  _arg2?: never,
): C[keyof C] extends () => infer R ? R : never

export function match<
  O extends object,
  K extends keyof O,
  const C extends MatchObjectCases<O, K>,
>(
  obj: O,
  key: K,
  cases: C
    & ('_' extends keyof C
      ? Record<Exclude<keyof C, MatchableValue<O, K> | '_'>, never>
      : Record<Exclude<keyof C, MatchableValue<O, K>>, never>
        & Record<Exclude<MatchableValue<O, K>, keyof C>, never>),
): {
  [K in keyof C]: C[K] extends (...args: any[]) => infer R ? R : never;
}[keyof C]

// @ts-expect-error implicit any
export function match(arg0, arg1, arg2) {
  const isObj = arg2 !== undefined

  const [value, cases, obj] = isObj ? [arg0[arg1], arg2, arg0] : [arg0, arg1]

  const handler = Object.hasOwn(cases, value)
    ? cases[value]
    : Object.hasOwn(cases, '_')
      ? cases._
      : undefined

  if (handler === undefined) {
    throw new PatternMismatchError(value)
  }

  return isObj ? handler(obj) : handler()
}
