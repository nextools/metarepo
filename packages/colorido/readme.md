# colorido

Set of helpers and types to work with RGBA colors as `[number, number, number, number]` tuples.

## Install

```
$ yarn add colorido
```

## Usage

```ts
type TColor = [number, number, number, number]

colorToString(color: TColor) => string

isColor(value: any) => value is TColor
```

```ts
import { colorToString, isColor } from 'colorido'

const color = [255, 0, 0, 1]

console.log(
  colorToString(color)
)
// "rgba(255, 0, 0, 1)"

console.log(
  isColor(color)
)
// true
```
