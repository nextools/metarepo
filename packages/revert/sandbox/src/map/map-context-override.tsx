import { useContext, useRef } from 'react'
import type { Context, FC, ExoticComponent, ReactNode } from 'react'
import { EMPTY_OBJECT, UNDEFINED } from 'tsfn'
import type { TExtend } from 'tsfn'

export const mapContextOverride = <K extends string, CP, P extends {}>(providerName: K, context: Context<CP>, getValue: (props: P, contextProps: CP) => Partial<CP>) =>
  (props: P): TExtend<P, { [k in K]: FC }> => {
    const contextValue = useContext(context)
    const contextProvider = useRef<ExoticComponent<{ children: ReactNode }>>(EMPTY_OBJECT)
    const contextValueRef = useRef(EMPTY_OBJECT)

    const mergedProps = { ...contextValue } as any
    const overrideProps = getValue(props, contextValue)

    // eslint-disable-next-line guard-for-in
    for (const key in overrideProps) {
      const value = overrideProps[key]

      if (value !== UNDEFINED) {
        mergedProps[key] = value
      }
    }

    contextValueRef.current = mergedProps

    if (contextProvider.current === EMPTY_OBJECT) {
      const Provider: FC = ({ children }) => (
        <context.Provider value={contextValueRef.current}>
          {children}
        </context.Provider>
      );

      (Provider as any).$$typeof = context.Provider.$$typeof
      Provider.displayName = providerName

      contextProvider.current = (Provider as any)
    }

    return {
      ...props,
      [providerName]: contextProvider.current,
    } as any
  }
