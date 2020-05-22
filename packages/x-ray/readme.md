# X-Ray

Screenshots/snapshots regression testing for React/React Native components.

* [Chrome screenshots](plugin-chromium-screenshots)
* Firefox screenshots (currently [on hold](https://wiki.mozilla.org/Remote))
* [iOS screenshots](plugin-ios-screenshots)
* [Android screenshots](plugin-android-screenshots)
* [React snapshots](plugin-react-snapshots)
* [React Native snapshots](plugin-react-native-snapshots)

## Usage

1. Provide a special file with exported iterable over a component usage examples:

```ts
type TExampleOptions = {
  // background color of component parent
  backgroundColor?: string,
  // limits max width of component parent
  maxWidth?: number,
  // controls an external overflow of comnponent, for example
  // to include a tooltip with `position: absolute`
  overflowTop?: number,
  overflowBottom?: number,
  overflowLeft?: number,
  overflowRight?: number,
  // controls whether a component should have an "own" width or not;
  // `false` by default, i.e. component is going to be stretched to
  // available parent (for example browser window) width
  hasOwnWidth?: boolean,
}

type TExample = {
  // unique ID of a specific example
  id: string,
  // React element 
  element: ReactElement,
  // options described above
  options?: TExampleOptions,
  // special serializable JSON that can be used later by a plugin
  // to render any useful information in X-Ray UI popup
  meta?: (element: ReactElement) => TJsonValue,
}
```

```ts
// examples.tsx
import { MyComponent } from './MyComponent'

export const examples = [
  {
    id: '1',
    element: (
      <MyCompopnent foo="bar"/>
    )
  },
  {
    id: '2',
    element: (
      <MyCompopnent foo="baz"/>
    )
  }
]

export const name = MyComponent.displayName
```

2. Connect X-Ray core with the necessary X-Ray plugin, for example to make and check Chromium screenshots:

```ts
import { xRay } from '@x-ray/core'
import { chromiumScreenshots } from '@x-ray/plugin-chromium-screenshots'

const xRayChromiumScreenshots = xRay(chromiumScreenshots())
```

3. Run X-Ray against the examples file(s):

```ts
await xRayChromiumScreenshots([
  './examples.tsx'
])
```

X-Ray will:

* import all input example files in parallel using Worker Threads
* iterate over examples iterable (array in the simplest case) one by one and make screenshots
* check for `./__data__/<name>-chromium-screenshots.tar.gz` relative to the examples file:
  * if it exists then unpack it and compare previous screenshots with the new ones using [`pixelmatch`](https://github.com/mapbox/pixelmatch) lib, producing the `OK`, `DIFF`, `NEW` or `DELETED` result types
  * if it doesn't exist then mark eveyrthing as `NEW` screenshot
* aggregate results across worker threads and launch X-Ray UI to allow user to approve or discard screenshots
* save/update `./__data__/<name>-chromium-screenshots.tar.gz` with the approved data

## How to

### Write a plugin

TBD.
