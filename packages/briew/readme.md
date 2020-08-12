# briew ![npm](https://flat.badgen.net/npm/v/briew)

Count React Native `createView` events passing through the [Bridge](https://medium.com/@jondot/debugging-react-native-performance-snoopy-and-the-messagequeue-fe014cd047ac).

## Install

```sh
$ yarn add briew
```

## Usage

```ts
type TOptions = {
  entryPointPath: string
}

const getAndroidViewCount: (options: TOptions) => Promise<number>

const getIosViewCount: (options: TOptions) => Promise<number>
```

```ts
import { getAndroidViewCount, getIosViewCount } from 'briew'

const androidViewCount = await getAndroidViewCount({
  entryPointPath: './App',
})

const iosViewCount = await getIosViewCount({
  entryPointPath: './App',
})
```
