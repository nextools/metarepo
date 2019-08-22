export const processSend = <T>(arg: T) =>
  new Promise<void>((resolve, reject) => {
    process.send!(arg, (err: Error | null) => {
      if (err !== null) {
        return reject(err)
      }

      resolve()
    })
  })
