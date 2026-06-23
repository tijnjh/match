import type { MatchableValue, MatchObjectCases } from './types'

/**
 * typesafe exhaustive matching for discriminated unions and objects
 *
 * @throws {Error} if no pattern matches the value
 */
export function match<
  TValue extends PropertyKey,
  THandlers,
>(
  value: TValue,
  handlers: THandlers & {
    [K in keyof THandlers]: THandlers[K] extends () => unknown ? unknown : never;
  } & ('_' extends keyof THandlers
    ? Record<Exclude<keyof THandlers, TValue | '_'>, never>
    : Record<Exclude<keyof THandlers, TValue>, never>
      & Record<Exclude<TValue, keyof THandlers>, never>),
  _arg2?: never,
): THandlers[keyof THandlers] extends () => infer R ? R : never

export function match<
  TValue extends object,
  TKey extends keyof TValue,
  const THandlers extends MatchObjectCases<TValue, TKey>,
>(
  value: TValue,
  key: TKey,
  handlers: THandlers
    & ('_' extends keyof THandlers
      ? Record<Exclude<keyof THandlers, MatchableValue<TValue, TKey> | '_'>, never>
      : Record<Exclude<keyof THandlers, MatchableValue<TValue, TKey>>, never>
        & Record<Exclude<MatchableValue<TValue, TKey>, keyof THandlers>, never>),
): {
  [K in keyof THandlers]: THandlers[K] extends (...args: any[]) => infer R ? R : never;
}[keyof THandlers]

// @ts-expect-error implicit any
export function match(arg0, arg1, arg2) {
  const isObj = arg2 !== undefined

  const [value, handlers, obj] = isObj ? [arg0[arg1], arg2, arg0] : [arg0, arg1]

  const handler = Object.hasOwn(handlers, value)
    ? handlers[value]
    : Object.hasOwn(handlers, '_')
      ? handlers._
      : undefined

  if (handler === undefined) {
    throw new Error(value)
  }

  return isObj ? handler(obj) : handler()
}
