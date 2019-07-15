# elegir

A simple function to do switch-like expressions that look good, so you don't have to nest your ternaries.

```js
import { elegir } from 'elegir'

export const isHuge = (planetName) => elegir(
  planetName === 'jupiter',
  true,

  planetName === 'saturn',
  true,

  true, // default case
  false
)
```

The way it works is that each _odd_ argument (1st, 3rd, 5th, …) will be treated as a condition, and if it is `true`, the next _even_ argument will be returned. The first condition to evaluate to `true` will end the chain.

So:

```js
isHuge('jupiter') // => true
isHuge('saturn') // => true
isHuge('mars') // => false
isHuge('earth') // => false
isHuge('anything else') // => false
```

> `elegir` simply means "to choose" in Spanish
