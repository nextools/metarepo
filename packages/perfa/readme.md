# perfa

Measure React app performance using dockerized Chromium through [`xrom`](https://github.com/bubble-dev/_/tree/master/packages/xrom) lib.

## Install

```sh
$ yarn add perfa
```

## Usage

```ts
type Options = {
  entryPointPath: string, // path to a React app entry point
  triesCount?: number, // `5` by default
  fontsDir?: string, // path to a directory with custom fonts to be installed
  isQuiet?: boolean, // `false` by default
}

type Result = {
  firstContentfulPaint: number,
  firstMeaningfulPaint: number,
  largestContentfulPaint: number,
  domContentLoaded: number,
  domInteractive: number,
  threadTime: number,
  scriptDuration: number,
  layoutDuration: number,
  recalcStyleDuration: number,
  usedJsHeapSize: number,
}

perfa(options: Options) => Promise<Result>
```

```js
import { getPerfData } from 'perfa'

const perfData = await getPerfData({
  entryPointPath: './App.tsx'
})
```

## Metrics

### `firstContentfulPaint`

> First Contentful Paint measures the time from navigation to the time when the browser renders the first bit of content from the DOM. This is an important milestone for users because it provides feedback that the page is actually loading.

https://developers.google.com/web/tools/lighthouse/audits/first-contentful-paint

### `firstMeaningfulPaint`

> First Meaningful Paint is essentially the paint after which the biggest above-the-fold layout change has happened, and web fonts have loaded.

https://developers.google.com/web/tools/lighthouse/audits/first-meaningful-paint

### `largestContentfulPaint`

> Largest Contentful Paint is an important, user-centric metric for measuring perceived load speed because it marks the point in the page load timeline when the page's main content has likely loaded—a fast LCP helps reassure the user that the page is useful.

https://web.dev/lcp/

### `domContentLoaded`

> The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.

https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event

### `domInteractive`

> A timestamp representing the time value equal to the time immediately before the user agent sets the current document readiness of the current document to interactive.

### `threadTime`

[Not really documented](https://chromedevtools.github.io/devtools-protocol/tot/Performance#method-getMetrics), likely the time of the main thread "to run all the JavaScript in your page, as well as to perform layout, reflows, and garbage collection"

https://developer.mozilla.org/en-US/docs/Glossary/Main_thread


### `scriptDuration`

> Combined duration of JavaScript execution.

https://github.com/puppeteer/puppeteer/blob/v2.1.1/docs/api.md#pagemetrics

### `layoutDuration`

> Combined durations of all page layouts.

https://github.com/puppeteer/puppeteer/blob/v2.1.1/docs/api.md#pagemetrics

### `recalcStyleDuration`

> Combined duration of all page style recalculations.

https://github.com/puppeteer/puppeteer/blob/v2.1.1/docs/api.md#pagemetrics

### `usedJsHeapSize`

> usedJsHeapSize is the total amount of memory being used by JS objects including V8 internal objects.

https://webplatform.github.io/docs/apis/timing/properties/memory/
