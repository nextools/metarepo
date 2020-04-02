# @rebox/web

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
  globalConstants?: {
    [key: string]: string
  },
  globalAliases?: {
    [key: string]: string
  },
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
  assetsPath?: string,
  isQuiet?: boolean, // false by default
  shouldOpenBrowser?: boolean // false by default
}

const runWebApp: (options: TRunWebAppOptions) => Promise<() => Promise<void>>
```

## Usage

```ts
// App.tsx
import React, { FC } from 'react'

export const App: FC<{}> = () => (
  <h1>Test</h1>
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
})
```

```ts
// run.ts
import { runWebApp } from '@rebox/web'

await runWebApp({
  entryPointPath: './App.tsx',
  htmlTemplatePath: './template.html'
})
```
