export const createTimeoutSpy = () => {
  let lastId = 0
  let timers: {
    id: number,
    cb: () => void,
    delay: number,
    isCleared: boolean,
  }[] = []
  const clearedIds: {
    id: number,
  }[] = []

  return {
    getSetTimeoutCalls() {
      return timers.map((timer) => [timer.delay])
    },
    getClearTimeoutCalls() {
      return clearedIds.map((clearedIds) => [clearedIds.id])
    },
    setTimeout(cb: () => void, delay: number) {
      const id = lastId++

      timers.push({
        id,
        cb,
        delay,
        isCleared: false,
      })

      return id
    },
    clearTimeout(id: number) {
      timers = timers.map((timer) => {
        if (timer.id === id) {
          timer.isCleared = true
        }

        return timer
      })

      clearedIds.push({ id })
    },
    tick() {
      timers.forEach((timer) => {
        if (timer.isCleared === false) {
          timer.cb()
        }

        timer.isCleared = true
      })
    },
  }
}

export const createRafSpy = () => {
  let lastId = 0
  let timers: {
    id: number,
    cb: () => void,
    isCleared: boolean,
  }[] = []
  const clearedIds: {
    id: number,
  }[] = []

  return {
    getRequestAnimationFrameCalls() {
      return new Array(timers.length).fill([])
    },
    getCancelAnimationFrameCalls() {
      return clearedIds.map((clearedIds) => [clearedIds.id])
    },
    requestAnimationFrame(cb: () => void) {
      const id = lastId++

      timers.push({
        id,
        cb,
        isCleared: false,
      })

      return id
    },
    cancelAnimationFrame(id: number) {
      timers = timers.map((timer) => {
        if (timer.id === id) {
          timer.isCleared = true
        }

        return timer
      })

      clearedIds.push({ id })
    },
    tick() {
      timers.forEach((timer) => {
        if (timer.isCleared === false) {
          timer.cb()
        }

        timer.isCleared = true
      })
    },
  }
}
