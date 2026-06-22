export type MatchableValue<O, K extends keyof O> = Extract<O[K], PropertyKey>

export type MatchObjectCases<O extends object, K extends keyof O> = Partial<{
  [V in MatchableValue<O, K>]: (obj: Extract<O, Record<K, V>>) => unknown;
}> & { _?: (obj: O) => unknown }
