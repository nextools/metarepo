# foreal ![npm](https://flat.badgen.net/npm/v/foreal)

Test React app with Puppeteer.

## Install

```sh
$ yarn add foreal
```

## Usage

```ts
type TGetAppPageOptions = {
  entryPointPath: string,
  fontsDir?: string,
  width?: number,
  height?: number,
  deviceScaleFactor?: number,
}

const getAppPage: (options: TGetAppPageOptions) => Promise<Page>
```

```tsx
// App.tsx
export const App = () => (
  <h1>hi</h1>
)
```

```ts
import { getAppPage } from 'foreal'

const page = await getAppPage({
  entryPointPath: './App.tsx'
})

const result = await page.$eval('h1', (el) => el.textContent)

console.log(result)
// 'hi'

// necessary to call when it's done
await page.close()
```
