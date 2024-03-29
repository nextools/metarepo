import type { TCommonComponentConfig } from 'autoprops'
import { pipe } from 'funcom'
import type { FC } from 'react'
import { startWithType, mapState, onUpdate } from 'refun'
import { isFunction, isDefined, isUndefined } from 'tsfn'
import type { TAnyObject } from 'tsfn'
import { getComponentName } from '../../utils'
import { getElementPath } from '../../utils/get-element-path'
import { getChildDisplayName } from './get-child-display-name'
import type { TPosition, TRect } from './types'

export type TMapInspectRect = {
  Component: FC | null,
  componentConfig: TCommonComponentConfig | null,
  componentPropsChildrenMap: Readonly<TAnyObject> | null,
  shouldInspect: boolean,
  selectedElementPath: string,
  componentWidth: number,
  componentHeight: number,
}

export const mapInspectRect = <P extends TMapInspectRect>() => pipe(
  startWithType<P & TMapInspectRect>(),
  mapState('selectedInspectRect', 'setSelectedInspectRect', () => null as TRect | null, ['Component', 'shouldInspect']),
  mapState('blockNode', 'setBlockNode', () => null as HTMLElement | null, []),
  onUpdate(({ Component, blockNode, shouldInspect, selectedElementPath, setSelectedInspectRect, componentConfig }) => {
    if (!shouldInspect || blockNode === null) {
      return
    }

    const findDomNode = (fiberNode: any): HTMLElement => {
      if (isUndefined(fiberNode)) {
        throw new Error('fiberNode is undefined')
      }

      if (fiberNode.stateNode !== null) {
        return fiberNode.stateNode
      }

      return findDomNode(fiberNode.child)
    }

    const getRect = (node: HTMLElement): TRect => {
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
      const pos = getPos(node)

      return ({
        left: pos.left,
        top: pos.top,
        width: node.offsetWidth,
        height: node.offsetHeight,
      })
    }

    let pathSegmentIndex = 0
    let currentChildIndex = 0
    const childPath = getElementPath(selectedElementPath)
    const visitFiberNode = (fiberNode: any) => {
      if (isFunction(fiberNode.elementType)) {
        if (childPath.length === 0) {
          const nodeDisplayName = getComponentName(fiberNode.elementType)
          const rootDisplayName = getComponentName(Component as FC)

          if (nodeDisplayName === rootDisplayName) {
            const node = findDomNode(fiberNode)

            setSelectedInspectRect(getRect(node))

            return
          }
        } else {
          const nodeDisplayName = getComponentName(fiberNode.elementType)
          const { childDisplayName, childDisplayNameIndex } = getChildDisplayName(componentConfig!, childPath, pathSegmentIndex)

          if (nodeDisplayName === childDisplayName) {
            if (currentChildIndex === childDisplayNameIndex) {
              currentChildIndex = 0
              ++pathSegmentIndex

              if (pathSegmentIndex >= childPath.length) {
                const node = findDomNode(fiberNode)

                setSelectedInspectRect(getRect(node))

                return
              }
            } else {
              ++currentChildIndex
            }
          }
        }
      }

      if (fiberNode.child !== null) {
        visitFiberNode(fiberNode.child)
      }

      if (pathSegmentIndex < childPath.length && fiberNode.sibling !== null) {
        visitFiberNode(fiberNode.sibling)
      }
    }

    const node = blockNode
    const key = Object.keys(node).find((key) => key.startsWith('__reactInternalInstance$'))

    if (isDefined(key)) {
      const instance = (node as any)[key]

      visitFiberNode(instance)
    }
  }, ['selectedElementPath', 'blockNode', 'shouldInspect', 'componentWidth', 'componentHeight', 'componentPropsChildrenMap'])
)
