import Circularr from 'circularr'
import { pipe } from 'funcom'
import { iterableFps } from 'ifps'
import { reduce, toValue } from 'iterama'
import { component, startWithType, onUpdate, mapWithProps, mapStateRef } from 'refun'
import { fontFamily } from './font/monospace-font-family'
import { Path } from './svg/Path'
import { Rect } from './svg/Rect'
import { Svg } from './svg/Svg'
import { Text } from './svg/Text'

const MAX_FPS = 60

export type TReFps = {
  backgroundColor: string,
  strokeColor: string,
  strokeWidth: number,
  fontSize: number,
  fontColor: string,
  width: number,
  height: number,
  graphLength: number,
}

export const ReFps = component(
  startWithType<TReFps>(),
  mapStateRef('data', 'flushData', ({ graphLength }) => new Circularr<number>(graphLength).fill(0), []),
  onUpdate(({ data, flushData }) => {
    let shouldCount = true

    void (async () => {
      const iterator = iterableFps[Symbol.asyncIterator]()

      // for-await-of doesn't work on React Native
      while (true) {
        const result = await iterator.next()

        if (!shouldCount || result.done === true) {
          break
        }

        const fps = result.value

        data.current.shift(fps)

        flushData()
      }
    })()

    return () => {
      shouldCount = false
    }
  }, []),
  mapWithProps(({ data, strokeWidth, width, height, graphLength }) => ({
    d: pipe(
      reduce<number, string>((result, value, i) => {
        return `${result} ${width * i / (graphLength - 1)},${(height - strokeWidth) * (MAX_FPS - value) / MAX_FPS + strokeWidth / 2}`
      }, ''),
      toValue
    )(data.current),
    fps: data.current.at(data.current.length - 1),
  }))
)(({ d, fps, backgroundColor, strokeColor, strokeWidth, fontSize, fontColor, width, height }) => (
  <Svg width={width} height={height}>
    <Rect width={width} height={height} fill={backgroundColor}/>
    <Path
      fill="none"
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      d={`M${d}`}
    />
    <Text
      fontSize={fontSize}
      fontFamily={fontFamily}
      textAnchor="end"
      x={width - 2}
      y={height - 4}
      fill={fontColor}
    >
      {fps}
    </Text>
  </Svg>
))
