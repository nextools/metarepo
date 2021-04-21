# @rebox/web ![npm](https://flat.badgen.net/npm/v/@rebox/web)

Set of helpers to deal with React applications using [our Babel config](https://github.com/nextools/metarepo/blob/master/packages/nextools/babel-config/src/web.js).

## Install

```sh
$ yarn add @rebox/web
```

## API

```ts
type TBuildWebAppReleaseOptions = {
  entryPointPath: string,
  htmlTemplatePath: string,
  outputPath: string,
  browsersList?: string[], // ['defaults'] by default
  globalConstants?: {
    [key: string]: string
  },
  globalAliases?: {
    [key: string]: string
  },
  props?: TJsonValue,
  isQuiet?: boolean, // false by default
  shouldGenerateSourceMaps?: boolean, // false by default
  shouldGenerateBundleAnalyzerReport?: boolean // false by default
}

const buildWebAppRelease: (userOptions: TBuildWebAppReleaseOptions) => Promise<void>
```

```ts
type TRunWebAppOptions = {
  entryPointPath: string,
  htmlTemplatePath: string,
  browsersList?: string[], // ['last 1 Chrome version', 'last 1 Firefox version'] by default
  assetsPath?: string,
  props?: TJsonValue,
  isQuiet?: boolean, // false by default
  shouldOpenBrowser?: boolean // false by default
}

const runWebApp: (options: TRunWebAppOptions) => Promise<() => Promise<void>>
```

## Usage

```ts
// App.tsx
import { FC } from 'react'

export type TApp = {
  color: string
}

export const App: FC<TApp> = ({ color }) => (
  <h1 style={{ color }}>Test</h1>
)
```

```html
<!-- template.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Test</title>
    <style>
      body { margin: 0 }
    </style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

```ts
// build.ts
import { buildWebAppRelease } from '@rebox/web'

await buildWebAppRelease({
  entryPointPath: './App.tsx',
  htmlTemplatePath: './template.html',
  outputPath: './build/',
  props: {
    color: '#ff0000'
  }
})
```

```ts
// run.ts
import { runWebApp } from '@rebox/web'

await runWebApp({
  entryPointPath: './App.tsx',
  htmlTemplatePath: './template.html',
  props: {
    color: '#ff0000'
  }
})
```
