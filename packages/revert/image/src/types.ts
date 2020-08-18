export type TImage = {
  id?: string,
  alt?: string,
  source: string,
  resizeMode?: 'cover' | 'contain',
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
