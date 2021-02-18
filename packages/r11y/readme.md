# r11y ![npm](https://flat.badgen.net/npm/v/r11y)

Get a11y data of React app and validate it using [Axe](https://github.com/dequelabs/axe-core) library.

## Install

```sh
$ yarn add r11y
```

## Usage

```ts
type TGetA11yDataOptions = {
  entryPointPath: string,
  fontsDir?: string
}

type TA11Data = {
  errors: {
    path: string | null,
    tag: string,
    attrs: TStringObject
  }[],
  navigationFlow: {
    path: string | null,
    tag: string,
    attrs: TStringObject
  }[]
}

const getA11yData: (options: TGetA11yDataOptions) => Promise<TA11Data>
```

```jsx
// App.jsx
const Field = () => (
  <input style={{ opacity: 0.1 }} value="input"/>
)

Field.displayName = 'Field'

const Button = () => (
  <div>
    <div role="button" aria-pressed={false} tabIndex={0}>button</div>
  </div>
)

Button.displayName = 'Button'

export const App = () => (
  <div>
    <Field/>
    <Button/>
  </div>
)
```

```ts
import { getA11yData } from 'r11y'

const result = await getA11yData({
  entryPointPath: require.resolve('./App'),
}

console.log(result)
// {
//   errors: [
//     { rule: 'color-contrast', path: 'Field', tag: 'input', attrs: {} },
//   ],
//   navigationFlow: [
//     { path: 'Field', tag: 'input', attrs: {} },
//     { path: 'Button > div', tag: 'div', attrs: { role: 'button', 'aria-pressed': 'false' } },
//   ],
// }
```
