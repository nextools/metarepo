import type { TColor } from '@revert/color'
import { rgba } from '@revert/color'
import { App as GraphsApp } from 'graphiq'
import type { TApp } from 'graphiq'
import { getObjectEntries, isDefined } from 'tsfn'
import { data } from './data'

const theme = {
  firstContentfulPaint: [rgba(46, 134, 193, 1), rgba(46, 193, 178, 1)] as [TColor, TColor],
  firstMeaningfulPaint: [rgba(192, 57, 43, 1), rgba(239, 105, 47, 1)] as [TColor, TColor],
  largestContentfulPaint: [rgba(155, 89, 182, 1), rgba(232, 118, 210, 1)] as [TColor, TColor],
  domContentLoaded: [rgba(231, 76, 60, 1), rgba(231, 162, 60, 1)] as [TColor, TColor],
  threadTime: [rgba(23, 165, 137, 1), rgba(74, 245, 126, 1)] as [TColor, TColor],
  scriptDuration: [rgba(90, 68, 173, 1), rgba(153, 100, 175, 1)] as [TColor, TColor],
  layoutDuration: [rgba(230, 126, 34, 1), rgba(230, 224, 34, 1)] as [TColor, TColor],
  recalcStyleDuration: [rgba(88, 131, 250, 1), rgba(88, 211, 250, 1)] as [TColor, TColor],
  usedJsHeapSize: [rgba(22, 160, 133, 1), rgba(83, 228, 200, 1)] as [TColor, TColor],
  vendorSize: [rgba(232, 67, 147, 1), rgba(253, 121, 168, 1)] as [TColor, TColor],
  vendorSizeGzip: [rgba(16, 172, 132, 1), rgba(29, 209, 161, 1)] as [TColor, TColor],
  mainSize: [rgba(128, 142, 155, 1), rgba(210, 218, 226, 1)] as [TColor, TColor],
  mainSizeGzip: [rgba(234, 181, 66, 1), rgba(250, 211, 144, 1)] as [TColor, TColor],
}
const graphs = data.reduce((acc, cur) => {
  for (const [key, value] of getObjectEntries(cur.values)) {
    const graph = acc.find((el) => el.graphName === key)

    // if (key !== 'firstContentfulPaint') {
    //   return acc
    // }

    if (isDefined(graph)) {
      graph.values.push({
        version: cur.title,
        value,
        timestamp: cur.timestamp,
      })
    } else {
      acc.push({
        graphName: key,
        colors: theme[key],
        values: [
          {
            version: cur.title,
            value,
            timestamp: cur.timestamp,
          },
        ],
      })
    }
  }

  return acc
}, [] as TApp['graphs'])

export const App = () => (
  <GraphsApp graphs={graphs}/>
)
