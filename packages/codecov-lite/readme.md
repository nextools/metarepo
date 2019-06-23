# codecov-lite

LCOV (code coverage data) uploader for [codecov.io](https://codecov.io/) service. Synced with [codecov-bash](https://github.com/codecov/codecov-bash).

* no CLI
* no local Git
* no GCOV features
* Promise-based API

## Supported services

* [AppVeyor](https://www.appveyor.com/)
* [Buildkite](https://buildkite.com/)
* [CircleCI](https://circleci.com/)
* [Codeship](https://codeship.com/)
* [drone.io](https://drone.io/)
* [GitLab](https://gitlab.com/)
* [Jenkins](https://jenkins.io/)
* [Semaphore](https://semaphoreci.com/)
* [Shippable](https://app.shippable.com/)
* [Snap CI](https://snap-ci.com/)
* [Travis CI](https://travis-ci.org/)
* [Wercker](http://wercker.com/)

## Install

```sh
$ yarn add --dev codecov-lite
```

## Usage

```js
import { readFile } from 'fs'
import { promisify } from 'util'
import codecov from 'codecov-lite'

(async () => {
  const pReadFile = promisify(readFile)
  const lcovData = readFile('./coverage/lcov.info', 'utf8')
  const { reportURL, config } = await codecov(lcovData)
})()
```
