# xrom

Run [dockerized Chromium in headless remote debugging mode](https://github.com/deepsweet/chromium-headless-remote) and return `browserWSEndpoint` needed for `puppeteer.connect()`.

## Install

```sh
$ yarn add xrom
```

## Usage

```ts
type Options = {
  containerName?: string,
  fontsDir?: string,
  mountVolumes?: {
    from: string,
    to: string,
  }[],
  cpus?: number,
  cpusetCpus?: number[],
  shouldCloseOnExit?: boolean,
}

runChromium(options: Options) => Promise<string>
```

```js
import { runChromium } from 'xrom'
import puppeteer from 'puppeteer-core'

const browserWSEndpoint = await runChromium({ shouldCloseOnExit: true })
const browser = await puppeteer.connect({ browserWSEndpoint })
```
