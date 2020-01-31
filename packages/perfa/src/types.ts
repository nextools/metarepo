export type TPerfPaint = {
  name: 'first-paint' | 'first-contentful-paint',
  startTime: number,
}[]

export type TPerfMetrics = {
  metrics: {
    name: string,
    value: number,
  }[],
}

export type TPerfObserverEntry = {
  renderTime?: number,
  loadTime: number,
}

export type TPerfResult = {
  firstContentfulPaint: number,
  firstMeaningfulPaint: number,
  largestContentfulPaint: number,
  domContentLoaded: number,
  threadTime: number,
  scriptDuration: number,
  layoutDuration: number,
  recalcStyleDuration: number,
  usedJsHeapSize: number,
}
