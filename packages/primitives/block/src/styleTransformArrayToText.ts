import {
  PerpectiveTransform,
  RotateTransform,
  RotateXTransform,
  RotateYTransform,
  RotateZTransform,
  ScaleTransform,
  ScaleXTransform,
  ScaleYTransform,
  SkewXTransform,
  SkewYTransform,
  TranslateXTransform,
  TranslateYTransform,
} from 'react-native'

export type TTransformObject =
  PerpectiveTransform |
  RotateTransform |
  RotateXTransform |
  RotateYTransform |
  RotateZTransform |
  ScaleTransform |
  ScaleXTransform |
  ScaleYTransform |
  TranslateXTransform |
  TranslateYTransform |
  SkewXTransform |
  SkewYTransform

// TODO: move to lada
export const styleTransformArrayToText = (x: string | TTransformObject[]) => {
  if (typeof x === 'string') {
    return x
  }

  return x.reduce(
    (acc, transform) => {
      if ('translateY' in transform) {
        return `${acc} translateY(${transform.translateY}px)`
      }

      if ('translateX' in transform) {
        return `${acc} translateX(${transform.translateX}px)`
      }

      if ('scale' in transform) {
        return `${acc} scale(${transform.scale})`
      }

      if ('scaleX' in transform) {
        return `${acc} scaleX(${transform.scaleX})`
      }

      if ('scaleY' in transform) {
        return `${acc} scaleY(${transform.scaleY})`
      }

      if ('rotate' in transform) {
        return `${acc} rotate(${transform.rotate})`
      }

      if ('rotateX' in transform) {
        return `${acc} rotateX(${transform.rotateX})`
      }

      if ('rotateY' in transform) {
        return `${acc} rotateX(${transform.rotateY})`
      }

      if ('rotateZ' in transform) {
        return `${acc} rotateZ(${transform.rotateZ})`
      }

      if ('perspective' in transform) {
        return `${acc} perspective(${transform.perspective})`
      }

      if ('skewX' in transform) {
        return `${acc} skewX(${transform.skewX})`
      }

      if ('skewY' in transform) {
        return `${acc} skewY(${transform.skewY})`
      }

      return acc
    },
    ''
  )
}
