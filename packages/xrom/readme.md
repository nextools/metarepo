# xrom ![npm](https://flat.badgen.net/npm/v/xrom)

Run [dockerized Chromium or Firefox in headless remote debugging mode](https://github.com/nextools/images) and return `browserWSEndpoint` needed for `puppeteer.connect()`.

## Install

```sh
$ yarn add xrom
```

## Usage

```ts
type TRunBrowserOptions = {
  browser: 'chromium' | 'firefox',
  version: string,
  port?: number,
  fontsDir?: string,
  mountVolumes?: {
    from: string,
    to: string,
  }[],
  cpus?: number,
  cpusetCpus?: number[]
}

type TRunBrowserResult = {
  browserWSEndpoint: string,
  closeBrowser: () => Promise<void>,
}

runBrowser(options: TRunBrowserOptions) => Promise<TRunBrowserResult>
```

```js
import { runBrowser } from 'xrom'
import puppeteer from 'puppeteer-core'

const { browserWSEndpoint } = await runBrowser({ browser: 'chromium' })
const browser = await puppeteer.connect({ browserWSEndpoint })
```
