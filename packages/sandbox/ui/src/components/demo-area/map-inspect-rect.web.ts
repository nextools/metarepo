import { startWithType, mapState, onChange } from 'refun'
import { pipe } from '@psxcode/compose'
import { isFunction, isDefined } from 'tsfn'
import { TDimensions } from '@primitives/size'
import { TRect, TPosition } from '../../types'
import { getPath } from '../../utils'

export type TMapInspactRect = {
  Component?: any,
  shouldInspect: boolean,
  selectedElementPath: string,
  componentSize: TDimensions,
}

export const mapInspectRect = <P extends TMapInspactRect>() => pipe(
  startWithType<P & TMapInspactRect>(),
  mapState('selectedInspectRect', 'setSelectedInspectRect', () => null as TRect | null, ['Component', 'shouldInspect']),
  mapState('blockNode', 'setBlockNode', () => null as HTMLElement | null, []),
  onChange(({ blockNode, shouldInspect, selectedElementPath, setSelectedInspectRect }) => {
    if (!shouldInspect || blockNode === null) {
      return
    }

    let pathSegmentIndex = 0
    let currentChildIndex = 0
    const path = getPath(selectedElementPath)

    const findDomNode = (inst: any): HTMLElement => {
      if (inst.stateNode !== null) {
        return inst.stateNode
      }

      return findDomNode(inst.child)
    }

    const getPos = (node: HTMLElement, left = 0, top = 0): TPosition => {
      if (node.offsetParent === null) {
        return {
          left,
          top,
        }
      }

      if (node.offsetParent === blockNode) {
        return {
          left: left + node.offsetLeft,
          top: top + node.offsetTop,
        }
      }

      return getPos(node.offsetParent as HTMLElement, left + node.offsetLeft, top + node.offsetTop)
    }

    const getRect = (node: HTMLElement): TRect => {
      const pos = getPos(node)

      return ({
        left: pos.left,
        top: pos.top,
        width: node.offsetWidth,
        height: node.offsetHeight,
      })
    }

    const printChildren = (inst: any) => {
      if (isFunction(inst.elementType)) {
        if (path.length === 0) {
          const node = findDomNode(inst)

          setSelectedInspectRect(getRect(node))

          return
        }

        if (inst.elementType.displayName === path[pathSegmentIndex].name) {
          if (path[pathSegmentIndex].index === currentChildIndex) {
            ++pathSegmentIndex
            currentChildIndex = 0

            if (pathSegmentIndex >= path.length) {
              const node = findDomNode(inst)

              setSelectedInspectRect(getRect(node))

              return
            }
          } else {
            ++currentChildIndex
          }
        }
      }

      if (pathSegmentIndex < path.length && inst.child !== null) {
        printChildren(inst.child)
      }

      if (pathSegmentIndex < path.length && inst.sibling !== null) {
        printChildren(inst.sibling)
      }

      if (pathSegmentIndex < path.length && inst.alternate !== null && inst.alternate.sibling !== null) {
        printChildren(inst.alternate.sibling)
      }
    }

    const node = blockNode.firstChild!
    const key = Object.keys(node).find((key) => key.startsWith('__reactInternalInstance$'))

    if (isDefined(key)) {
      const instance = (node as any)[key].return

      printChildren(instance)
    }
  }, ['selectedElementPath', 'blockNode', 'shouldInspect', 'componentSize'])
)
