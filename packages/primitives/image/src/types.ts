import { TThemeableImage } from '@themeables/image'

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
  onLoad?: () => void,
  onError?: () => void,
} & TThemeableImage
