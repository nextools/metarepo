# @perfa/native ![npm](https://flat.badgen.net/npm/v/@perfa/native)

Measure React Native app performance.

## Install

```sh
$ yarn add @perfa/native
```

## Usage

```ts
type TGetPerfDataOptions = {
  entryPointPath: string,
  dependencyNames?: string[],
}

type TPerfData = {
  viewCount: number,
  usedMemory: number,
}}

const getAndroidPerfData: (options: TGetPerfDataOptions) => Promise<TPerfData>

const getIosPerfData: (options: TGetPerfDataOptions) => Promise<TPerfData>
```

```ts
import { getAndroidPerfData, getIosPerfData } from '@perfa/native'

const androidPerfData = await getAndroidPerfData({
  entryPointPath: './App',
})

const iosPerfData = await getIosPerfData({
  entryPointPath: './App',
})
```

## Metrics

### `viewCount`

Count of React Native `createView` events passing through the [Bridge](https://medium.com/@jondot/debugging-react-native-performance-snoopy-and-the-messagequeue-fe014cd047ac).

### `usedMemory`

App memory usage, in bytes.
