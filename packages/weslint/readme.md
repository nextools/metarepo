# weslint

Worker Threads + ESlint.

:warning: Node.js v10 needs an `--experimental-worker` flag.

## Install

```sh
$ yarn add weslint
```

## API

```ts
type TWeslintOptions = {
  files: string[],
  maxThreadCount?: number,
  formatter?: string,
  eslint?: CLIEngine.Options,
}

type TWeslintResult = {
  hasErrors: boolean,
  hasWarnings: boolean,
  formattedReport: string,
}

const weslint: (options: TWeslintOptions) => Promise<TWeslintResult>
```

* `files` – array of file paths
* `maxThreadCount` – `cpus().length` by default
* `formatter` – [ESLint formatter name](https://eslint.org/docs/developer-guide/nodejs-api#cliengine-getformatter)
* `eslint` – [ESLint CLIEngine options](https://eslint.org/docs/developer-guide/nodejs-api#cliengine)

## Usage

```ts
import { weslint } from 'weslint'

const result = await weslint({
  files: ['./file1.ts', './file2.ts']
})

if (result.hasErrors || result.hasWarnings) {
  console.log(result.formattedReport)
}

if (result.hasErrors) {
  throw new Error('oops')
}
```
