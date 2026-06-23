<h1>@tijnjh/match</h1>

<p>
typesafe & exhaustive pattern matching for discriminated unions and objects
</p>

```tsx
import { match } from '@tijnjh/match'

type Data
  = | { type: 'text', content: string }
    | { type: 'img', src: string }

type Result
  = | { type: 'ok', data: Data }
    | { type: 'error', error: Error }

declare const result: Result

const html = match(result, 'type', {
  error: () => <p>Oops! An error occurred</p>,
  ok: ({ data }) => match(data, 'type', {
    text: ({ content }) => <p>{content}</p>,
    img: ({ src }) => <img src={src} />,
  }),
})
```

## features
- very small bundle size (less than 200 bytes)
- concise syntax, no method chaining

## usage 

```sh
pnpm add @tijnjh/match
```

```ts
import { match } from '@tijnjh/match'

declare const color: 'red' | 'green' | 'blue'

match(color, {
  red: () => 1,
  green: () => 2,
  blue: () => 3,
})

match(color, {
  red: () => 1,
  green: () => 2,
  // ERROR: Property 'blue' is missing
})

match(color, {
  red: () => 1,
  green: () => 2,
  blue: () => 3,
  yellow: () => 4,
  // ERROR: Property 'yellow' is not a valid case
})
```

## inspired by 
- [gvergnaud/ts-pattern](https://github.com/gvergnaud/ts-pattern)
- rust `match`
- [suchipi/match-discriminated-union](https://github.com/suchipi/match-discriminated-union)