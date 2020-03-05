<p align="center">
  <img src="logo.svg" width="240" height="240"/>
</p>

<p align="center">
  <a href="https://travis-ci.org/bubble-dev/_"><img src="https://flat.badgen.net/travis/bubble-dev/_/master?label=tests"/></a> <a href="https://codecov.io/github/bubble-dev/_"><img src="https://flat.badgen.net/codecov/c/github/bubble-dev/_/master"/></a> <a href="https://t.me/joinchat/HEiFoBOD3u0of_nkCB6huQ"><img src="https://flat.badgen.net/badge/chat/telegram/blue"/></a>
</p>

The _metarepo_ is a single repository that consists of many packages and various monorepos, a new concept that we are trying out to simplify the development process. Many of the projects presented here are dependencies of each other, so we can iterate in all at the same time and benefit from using [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

Check the individual documentations for more details:

* [@auto](packages/auto): set of helpers for managing and developing monorepos
* [autoprops](packages/autoprops): tool that generates all possible combinations of React props and children based on declarative config, respecting "mutex" and "mutin" features
* [bro-resolve](packages/bro-resolve): resolve a module from its `browser` field in `package.json`
* [bsc](packages/bsc): binary search with comparator
* [@bubble-dev](packages/bubble-dev): [start](packages/start) preset and various shared configs to develop, test, build and publish packages in this metarepo
* [codecov-lite](packages/codecov-lite): LCOV (code coverage data) uploader for [codecov.io](https://codecov.io/) service.
* [colorido](packages/colorido): set of helpers and types to work with RGBA colors as `[number, number, number, number]` tuples
* [copie](packages/copie): copy a file
* [dleet](packages/dleet): delete directories and files
* [ekst](packages/ekst): append, prepend, replace or remove file basename extensions
* [elegir](packages/elegir): switch-like expressions that look good
* [@fantasy-color](packages/fantasy-color): color manipulation functions
* [fixdeps](packages/fixdeps): automatically add missing or remove unnecessary (dev)dependencies
* [graphiq](packages/graphiq): React component to render various SVG graphs at one plot
* [import-wasm](packages/import-wasm): async/sync helpers to import `.wasm` modules in Node.js
* [makethen](packages/makethen): strongly typed (up to 3 arguments and 3 result params) promisify for Node.js-style callbacks
* [mnth](packages/mnth): framework-agnostic base block to build calendars, datepickers, etc by rendering 2d array of Dates
* [mocku](packages/mocku): imports mocking library
* [move-path](packages/move-path): move path to destination folder
* [perfa](packages/perfa): measure React app performance using dockerized Chromium through [xrom](packages/xrom) lib
* [pifs](packages/pifs): promisified [graceful-fs](https://github.com/isaacs/node-graceful-fs)
* [@primitives](packages/primitives): set of universal React/React Native base components
* [@rebox](packages/rebox): set of helpers to dev and build React/React Native apps, completely abstracts out of `ios` and `android` folders
* [refun](packages/refun): strongly-typed React Hook-enabled functions that compose harmoniously with each other
* [rn-fonts](packages/rn-fonts): custom fonts linker for React Native (iOS/Android)
* [rn-resolve](packages/rn-resolve): resolve a module from its `react-native` field in `package.json`
* [rplace](packages/rplace): transform stream by replacing strings on per-line basis, especially efficient with large multiline text file formats
* [@sandbox](packages/sandbox): React sandbox to show off components with all possible props and children combinations using [autoprops](packages/autoprops)
* [siza](packages/siza): get bundle size of a React application
* [spyfn](packages/spyfn): spy function
* [spyt](packages/spyt): `setTimeout`/`requestAnimationFrame` spies
* [@start](packages/start): functional, fast and shareable task runner
* [stili](packages/stili): universal React/Reat Native styles normalizer
* [syntx](packages/syntx): serialize React component into a flat array of typed elements to build a custom syntax highlighting
* [@themeables](packages/themeables): themeable UI primitive set for building universal React/React Native design systems
* [tsfn](packages/tsfn): set of strongly-typed helpers and various utility types
* [typeon](packages/typeon): typed JSON parse and stringify for TypeScript
* [weslint](packages/weslint): Worker Threads + ESlint
* [workerama](packages/workerama): run sync/async function across Worker Threads
* [x-ray](packages/x-ray): extremely fast set of libraries for regressions testing of Chrome/Firefox/iOS/Android screenshots and Web/React Native snapshots
* [xrom](packages/xrom): run dockerized Chromium in headless remote debugging mode and return `browserWSEndpoint` needed for `puppeteer.connect()`
