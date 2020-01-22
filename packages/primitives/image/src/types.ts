import { TThemeableImage } from '@themeables/image'

export type TImage = {
  id?: string,
  alt?: string,
  source: string,
  onLoad?: () => void,
  onError?: () => void,
} & TThemeableImage
