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
  dockerUrlRoot?: string
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


### Overriding the docker root URL to another set of browser images
You can override the root URL to use some other set of docker images of Chromium and/or Firefox.


Make sure the final link, which is evaluated as `${dockerUrlRoot}/${browser}:${version}`, points to a docker image that is valid and public.

```js
const { browserWSEndpoint, closeBrowser } = await runBrowser({
  dockerUrlRoot: 'ghcr.io/shenato/docker-browser',
  browser: 'chromium',
  version: opts.chromiumVersion,
  fontsDir: opts.fontsDir,
})
```