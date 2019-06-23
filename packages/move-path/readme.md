# move-path

Move path to destination folder.

## Install

```sh
$ yarn add move-path
```

## Usage

```js
movePath(from, to)
```

Handles both relative and absolute `from` and `to` and returns an absolute destination path.

```js
import movePath from 'move-path'

movePath('src/foo/bar/index.js', 'build/baz/')
// /absolute/build/baz/foo/bar/index.js

movePath('src/foo/bar/', 'build/baz/')
// /absolute/build/baz/foo/bar/

movePath('src/foo/bar/index.js', 'src/foo/')
// /absolute/src/foo/bar/index.js

movePath('src/foo/bar/', 'src/foo/bar')
// /absolute/src/foo/bar/

movePath('src/foo/bar/index.js', '/build/')
// /build/foo/bar/index.js

movePath('src/foo/bar/index.js', './')
// /absolute/src/foo/bar/index.js
```
