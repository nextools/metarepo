# refps ![npm](https://flat.badgen.net/npm/v/refps)

React/React Native FPS counter with graph.

<img src="screenshot.png" width="200" height="80" alt="screenshot"/>

## Install

```sh
$ yarn add refps
```

## Usage

```ts
type TReFps = {
  backgroundColor: string,
  strokeColor: string,
  strokeWidth: number,
  fontSize: number,
  fontColor: string,
  width: number,
  height: number,
  graphLength: number,
}
```

```tsx
import { ReFps } from 'refps'

export const App = () => (
  <ReFps
    backgroundColor="black"
    strokeColor="red"
    strokeWidth={4}
    fontSize={12}
    fontColor="white"
    width={100}
    height={50}
    graphLength={10}
  />
)
```
