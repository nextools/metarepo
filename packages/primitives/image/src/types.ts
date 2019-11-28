export type TImage = {
  id?: string,
  alt?: string,
  source: string,
  height: number,
  width: number,
  topLeftRadius?: number,
  topRightRadius?: number,
  bottomRightRadius?: number,
  bottomLeftRadius?: number,
  resizeMode?: 'contain' | 'cover',
  onLoad?: () => void,
  onError?: () => void,
}
