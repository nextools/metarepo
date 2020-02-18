# siza

Get bundle size of a React application.

## Install

```sh
$ yarn add siza
```

## Usage

```ts
type TOptions = {
  entryPointPath: string,
  globalConstants?: {
    [key: string]: string,
  },
  globalAliases?: {
    [key: string]: string,
  }
}

type TOutput = {
  vendor: {
    min: number,
    minGzip: number,
  },
  main: {
    min: number,
    minGzip: number,
  }
}

getBundleSize(options: TOptions) => Promise<TOutput>
```

```ts
import { getBundleSize } from 'siza'

const result = await getBundleSize({
  entryPointPath: './App.tsx'
})

console.log(result)
/*
{
  vendor: { min: 129231, minGzip: 40706 },
  main: { min: 293, minGzip: 214 }
}
*/
```
