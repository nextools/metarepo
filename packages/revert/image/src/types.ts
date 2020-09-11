export type TImageContext = {
  onImageLoad?: () => void,
  onImageError?: () => void,
}

export type TImage = {
  id?: string,
  alt?: string,
  width?: number,
  height?: number,
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
  width?: number,
  height?: number,
}
