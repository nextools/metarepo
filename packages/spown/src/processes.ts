import type { ChildProcess } from 'child_process'
import onExit from 'signal-exit'

export const processPool = new Set<ChildProcess>()

let isHooked = false

export const hookOnExit = () => {
  if (isHooked) {
    return
  }

  isHooked = true

  onExit((signal: number | null) => {
    for (const childProcess of processPool) {
      if (signal !== null) {
        childProcess.kill(signal)
      } else {
        childProcess.kill()
      }
    }
  })
}
