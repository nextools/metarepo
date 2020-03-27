import { TStyle } from 'stili'

export type TImage = {
  id?: string,
  alt?: string,
  source: string,
  resizeMode?: TStyle['resizeMode'],
  radius?: number,
  topLeftRadius?: number,
  topRightRadius?: number,
  bottomLeftRadius?: number,
  bottomRightRadius?: number,
  onLoad?: () => void,
  onError?: () => void,
}

export type TPrimitiveImage = TImage & {
  width: number,
  height: number,
}
