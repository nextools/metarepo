# 🐣 plugin-spawn

Spawn new child process.

## Install

```sh
$ yarn add --dev @start/plugin-spawn
```

## Usage

### Signature

```ts
const spawn: (command: string): StartPlugin
```

### Example

```js
import spawn from '@start/plugin-spawn'

export task = () => spawn('node --version')
```
