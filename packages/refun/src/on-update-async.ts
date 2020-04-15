import { useRef, useEffect } from 'react'
import { EMPTY_OBJECT, NOOP, EMPTY_ARRAY } from 'tsfn'
import { shallowEqualByKeys, unwindGenerator, generatorIdFactory } from './utils'

type TCoroutineProps = {
  cancelOthers: () => void,
  index: number,
}

type GeneratorFactory = (props: TCoroutineProps) => Generator<Promise<any>, void, any>
type RefObject<T> = {
  current: T,
}

export const onUpdateAsync = <P extends {}> (onUpdateFn: (props: RefObject<P>) => GeneratorFactory, watchKeys: (keyof P)[]) => (props: P): P => {
  const useEffectFnRef = useRef<() => void>(NOOP)
  const onUnmountRef = useRef<() => void>(NOOP)
  const propsRef = useRef<P>(EMPTY_OBJECT)
  const watchValuesRef = useRef<any>(EMPTY_ARRAY)
  const isMountedRef = useRef(true)
  const createGeneratorRef = useRef<GeneratorFactory>(NOOP as any)
  const idsRef = useRef<ReturnType<typeof generatorIdFactory>>(EMPTY_OBJECT)

  if (watchValuesRef.current === EMPTY_ARRAY || !shallowEqualByKeys(propsRef.current, props, watchKeys)) {
    watchValuesRef.current = watchKeys.map((k) => props[k])
  }

  propsRef.current = props

  if (useEffectFnRef.current === NOOP) {
    useEffectFnRef.current = () => {
      if (createGeneratorRef.current === NOOP as any) {
        createGeneratorRef.current = onUpdateFn(propsRef)
      }

      if (idsRef.current === EMPTY_OBJECT) {
        idsRef.current = generatorIdFactory()
      }

      const generatorId = idsRef.current.newId()

      unwindGenerator(
        createGeneratorRef.current({
          cancelOthers: idsRef.current.switchToGenerator(generatorId),
          index: generatorId,
        }),
        () => {
          console.log('SHOULD_CONTINUE', generatorId)
          console.log('isMounted', generatorId, isMountedRef.current)
          console.log('isRunning', generatorId, idsRef.current.isGeneratorRunning(generatorId))

          return isMountedRef.current && idsRef.current.isGeneratorRunning(generatorId)
        }
      )
    }
  }

  useEffect(useEffectFnRef.current, watchValuesRef.current)

  if (onUnmountRef.current === NOOP) {
    onUnmountRef.current = () => () => {
      isMountedRef.current = false
    }
  }

  useEffect(onUnmountRef.current, EMPTY_ARRAY)

  return props
}
