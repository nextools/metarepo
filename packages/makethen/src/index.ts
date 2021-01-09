export type NodeCallback0 = (err: any) => void
export type NodeCallback1<R> = (err: any, res: R) => void
export type NodeCallback2<R1, R2> = (err: any, res1: R1, res2: R2) => void
export type NodeCallback3<R1, R2, R3> = (err: any, res1: R1, res2: R2, res3: R3) => void

function makethen<R1, R2, R3>(fn: (cb: NodeCallback3<R1, R2, R3>) => void): () => Promise<[R1, R2, R3]>
function makethen<R1, R2>(fn: (cb: NodeCallback2<R1, R2>) => void): () => Promise<[R1, R2]>
function makethen<R>(fn: (cb: NodeCallback1<R>) => void): () => Promise<R>
function makethen<R = void>(fn: (cb: NodeCallback0) => void): () => Promise<R>
function makethen<A, R1, R2, R3>(fn: (arg: A, cb: NodeCallback3<R1, R2, R3>) => void): (arg: A) => Promise<[R1, R2, R3]>
function makethen<A, R1, R2>(fn: (arg: A, cb: NodeCallback2<R1, R2>) => void): (arg: A) => Promise<[R1, R2]>
function makethen<A, R>(fn: (arg: A, cb: NodeCallback1<R>) => void): (arg: A) => Promise<R>
function makethen<A, R = void>(fn: (arg: A, cb: NodeCallback0) => void): (arg: A) => Promise<R>
function makethen<A1, A2, R1, R2, R3>(fn: (arg1: A1, arg2: A2, cb: NodeCallback3<R1, R2, R3>) => void): (arg1: A1, arg2: A2) => Promise<[R1, R2, R3]>
function makethen<A1, A2, R1, R2>(fn: (arg1: A1, arg2: A2, cb: NodeCallback2<R1, R2>) => void): (arg1: A1, arg2: A2) => Promise<[R1, R2]>
function makethen<A1, A2, R>(fn: (arg1: A1, arg2: A2, cb: NodeCallback1<R>) => void): (arg1: A1, arg2: A2) => Promise<R>
function makethen<A1, A2, R = void>(fn: (arg1: A1, arg2: A2, cb: NodeCallback0) => void): (arg1: A1, arg2: A2) => Promise<R>
function makethen<A1, A2, A3, R1, R2, R3>(fn: (arg1: A1, arg2: A2, arg3: A3, cb: NodeCallback3<R1, R2, R3>) => void): (arg1: A1, arg2: A2, arg3: A3) => Promise<[R1, R2, R3]>
function makethen<A1, A2, A3, R1, R2>(fn: (arg1: A1, arg2: A2, arg3: A3, cb: NodeCallback2<R1, R2>) => void): (arg1: A1, arg2: A2, arg3: A3) => Promise<[R1, R2]>
function makethen<A1, A2, A3, R>(fn: (arg1: A1, arg2: A2, arg3: A3, cb: NodeCallback1<R>) => void): (arg1: A1, arg2: A2, arg3: A3) => Promise<R>
function makethen<A1, A2, A3, R = void>(fn: (arg1: A1, arg2: A2, arg3: A3, cb: NodeCallback0) => void): (arg1: A1, arg2: A2, arg3: A3) => Promise<R>

function makethen(fn: any) {
  return (...args: any[]) => new Promise((resolve, reject) => {
    fn(...args, (error: any, ...results: any[]) => {
      // Node.js 8.11.3 LTS `fs.utimes()` returns `undefined`
      // instead of `null` as a first argument
      if (error != null) {
        return reject(error)
      }

      if (results.length === 0) {
        // @ts-ignore
        return resolve()
      }

      if (results.length === 1) {
        return resolve(results[0])
      }

      resolve(results)
    })
  })
}

export default makethen
