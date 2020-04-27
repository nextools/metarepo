import React from 'react'
import { App as GraphsApp, TGraph } from 'graphiq'
import { getObjectEntries, isDefined } from 'tsfn'
import { TColor } from 'colorido'
import { data } from './data'

const theme = {
  firstContentfulPaint: [[46, 134, 193, 1], [46, 193, 178, 1]] as [TColor, TColor],
  firstMeaningfulPaint: [[192, 57, 43, 1], [239, 105, 47, 1]] as [TColor, TColor],
  largestContentfulPaint: [[155, 89, 182, 1], [232, 118, 210, 1]] as [TColor, TColor],
  domContentLoaded: [[231, 76, 60, 1], [231, 162, 60, 1]] as [TColor, TColor],
  threadTime: [[23, 165, 137, 1], [74, 245, 126, 1]] as [TColor, TColor],
  scriptDuration: [[90, 68, 173, 1], [153, 100, 175, 1]] as [TColor, TColor],
  layoutDuration: [[230, 126, 34, 1], [230, 224, 34, 1]] as [TColor, TColor],
  recalcStyleDuration: [[88, 131, 250, 1], [88, 211, 250, 1]] as [TColor, TColor],
  usedJsHeapSize: [[22, 160, 133, 1], [83, 228, 200, 1]] as [TColor, TColor],
  vendorSize: [[232, 67, 147, 1], [253, 121, 168, 1]] as [TColor, TColor],
  vendorSizeGzip: [[16, 172, 132, 1], [29, 209, 161, 1]] as [TColor, TColor],
  mainSize: [[128, 142, 155, 1], [210, 218, 226, 1]] as [TColor, TColor],
  mainSizeGzip: [[234, 181, 66, 1], [250, 211, 144, 1]] as [TColor, TColor],
}
const graphs = data.reduce((acc, cur) => {
  for (const [key, value] of getObjectEntries(cur.values)) {
    const graph = acc.find((el) => el.key === key)

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
        key,
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
}, [] as TGraph[])

export const App = () => (
  <GraphsApp graphs={graphs}/>
)
