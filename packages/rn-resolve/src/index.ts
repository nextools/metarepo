import path from 'path'
import resolve from 'enhanced-resolve'
import getCallerFile from 'get-caller-file'

const resolver = resolve.create({
  mainFields: ['react-native'],
})

export const rnResolve = (target: string) => new Promise<string>((resolve, reject) => {
  const callerDir = path.dirname(getCallerFile(4))

  resolver(callerDir, target, (err, result) => {
    if (err !== null) {
      return reject(err)
    }

    resolve(result)
  })
})
