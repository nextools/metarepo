/* eslint-disable no-loop-func */
import { requestAnimationFrame, performance } from 'globl'
import { MAX_FPS } from './max-fps'

export const iterableFps = ({
  async *[Symbol.asyncIterator]() {
    let last = performance.now()

    while (true) {
      let fps = 0

      yield new Promise<number>((resolve) => {
        const loop = (now: number) => {
          if (now - last <= 1000) {
            fps++

            return requestAnimationFrame(loop)
          }

          last = now

          resolve(Math.min(fps, MAX_FPS))
        }

        requestAnimationFrame(loop)
      })
    }
  },
})
