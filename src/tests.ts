/* eslint-disable ts/no-unused-expressions */
import { match } from './match'

declare const color: 'red' | 'green' | 'blue'
declare const status: 'idle' | 'loading' | 'error'
declare const size: 'sm' | 'md' | 'lg'
declare const n: 1 | 2 | 3
declare const maybe: 'yes' | 'no' | 'maybe'

// union / literals / exhaustive
match(color, {
  red: () => 0,
  green: () => 1,
  blue: () => 2,
}) satisfies 0 | 1 | 2

// union / literals / fallback
match(color, {
  red: () => 0,
  _: () => 1,
}) satisfies 0 | 1

// string union / string literals / exhaustive
match(status, {
  idle: () => 'waiting',
  loading: () => 'busy',
  error: () => 'failed',
}) satisfies 'waiting' | 'busy' | 'failed'

// string union / object literals / exhaustive
match(status, {
  idle: () => ({ state: 'idle' as const }),
  loading: () => ({ state: 'loading' as const }),
  error: () => ({ state: 'error' as const }),
}) satisfies { state: 'idle' } | { state: 'loading' } | { state: 'error' }

// string union / object literals / fallback
match(status, {
  error: () => ({ ok: false as const }),
  _: () => ({ ok: true as const }),
}) satisfies { ok: false } | { ok: true }

// numeric union / exhaustive
match(n, {
  1: () => 'one',
  2: () => 'two',
  3: () => 'three',
}) satisfies 'one' | 'two' | 'three'

// numeric union / fallback
match(n, {
  1: () => 'one',
  _: () => 'many',
}) satisfies 'one' | 'many'

// mixed return literals
match(size, {
  sm: () => 1,
  md: () => 'medium',
  lg: () => true,
}) satisfies 1 | 'medium' | true

// nullish returns
match(maybe, {
  yes: () => true,
  no: () => false,
  maybe: () => null,
}) satisfies true | false | null

// undefined return
match(maybe, {
  yes: () => 'yes',
  no: () => 'no',
  maybe: () => undefined,
}) satisfies 'yes' | 'no' | undefined

// fallback can cover multiple missing cases
match(maybe, {
  yes: () => 1,
  _: () => 0,
}) satisfies 1 | 0

// all fallback
match(color, {
  _: () => 'fallback',
}) satisfies 'fallback'

// readonly-ish literal arrays
match(color, {
  red: () => ['r'] as const,
  green: () => ['g'] as const,
  blue: () => ['b'] as const,
})

// nested object literals
match(status, {
  idle: () => ({ type: 'idle' as const, canCancel: false as const }),
  loading: () => ({ type: 'loading' as const, canCancel: true as const }),
  error: () => ({ type: 'error' as const, canRetry: true as const }),
}) satisfies
| { type: 'idle', canCancel: false }
| { type: 'loading', canCancel: true }
| { type: 'error', canRetry: true }

// literal input value
match('red', {
  red: () => 123,
}) satisfies 123

// widened string with fallback
declare const widenedString: string

match(widenedString, {
  hello: () => 1,
  _: () => 0,
}) satisfies 1 | 0

// widened number with fallback
declare const widenedNumber: number

match(widenedNumber, {
  1: () => 'one',
  _: () => 'other',
}) satisfies 'one' | 'other'

type Shape
  = | { kind: 'circle', radius: number }
    | { kind: 'square', size: number }
    | { kind: 'rect', width: number, height: number }

declare const shape: Shape

// object input value / exhaustive discriminated union
match(shape, 'kind', {
  circle: () => 1 as const,
  square: () => 2 as const,
  rect: () => 3 as const,
}) satisfies 1 | 2 | 3

// object input value / exhaustive / narrowed handler args
match(shape, 'kind', {
  circle: shape => shape.radius,
  square: shape => shape.size,
  rect: shape => shape.width * shape.height,
}) satisfies number

// object input value / handler arg is narrowed to circle
match(shape, 'kind', {
  circle: (shape) => {
    shape.radius satisfies number

    // @ts-expect-error square-only property is not available on circle
    shape.size

    // @ts-expect-error rect-only property is not available on circle
    shape.width

    return 1 as const
  },
  square: () => 2 as const,
  rect: () => 3 as const,
}) satisfies 1 | 2 | 3

// object input value / handler arg is narrowed to square
match(shape, 'kind', {
  circle: () => 1 as const,
  square: (shape) => {
    shape.size satisfies number

    // @ts-expect-error circle-only property is not available on square
    shape.radius

    // @ts-expect-error rect-only property is not available on square
    shape.height

    return 2 as const
  },
  rect: () => 3 as const,
}) satisfies 1 | 2 | 3

// object input value / handler arg is narrowed to rect
match(shape, 'kind', {
  circle: () => 1 as const,
  square: () => 2 as const,
  rect: (shape) => {
    shape.width satisfies number
    shape.height satisfies number

    // @ts-expect-error circle-only property is not available on rect
    shape.radius

    // @ts-expect-error square-only property is not available on rect
    shape.size

    return 3 as const
  },
}) satisfies 1 | 2 | 3

// object input value / fallback
match(shape, 'kind', {
  circle: shape => shape.radius,
  _: () => 0,
}) satisfies number

// object input value / only fallback
match(shape, 'kind', {
  _: shape => shape.kind,
}) satisfies Shape['kind']

// object input value / fallback receives the full original union
match(shape, 'kind', {
  circle: (shape) => {
    shape.radius satisfies number
    return 1 as const
  },
  _: (shape) => {
    shape.kind satisfies Shape['kind']

    // @ts-expect-error fallback is not narrowed to only the unmatched variants
    shape.size

    return 0 as const
  },
}) satisfies 0 | 1

// object input value / missing cases without fallback
// @ts-expect-error missing square and rect
match(shape, 'kind', {
  circle: shape => shape.radius,
})

// object input value / extra case
// @ts-expect-error triangle is not a valid kind
match(shape, 'kind', {
  circle: () => 1,
  square: () => 2,
  rect: () => 3,
  triangle: () => 4,
})

// object input value / extra case is still rejected with fallback
// @ts-expect-error triangle is not a valid kind
match(shape, 'kind', {
  circle: () => 1,
  _: () => 0,
  triangle: () => 4,
})
