import { getObjectKeys } from 'tsfn'

export const resolutions = {
  mobile: {
    label: 'Mobile',
    width: 230,
    height: 410,
  },
  mobileLandscape: {
    label: 'Mobile Landscape',
    width: 410,
    height: 230,
  },
  tablet: {
    label: 'Tablet',
    width: 432,
    height: 768,
  },
  tabletLandscape: {
    label: 'Tablet Landscape',
    width: 768,
    height: 432,
  },
  desktop: {
    label: 'Desktop',
    width: 675,
    height: 1200,
  },
  desktopLandcape: {
    label: 'Desktop Landscape',
    width: 1200,
    height: 675,
  },
  desktopLarge: {
    label: 'Desktop Large',
    width: 900,
    height: 1600,
  },
  desktopLargeLandscape: {
    label: 'Desktop Large Landscape',
    width: 1600,
    height: 900,
  },
} as const

export type TResolutionKey = keyof typeof resolutions

export const findResolutionKey = (width: number, height: number): TResolutionKey | null => {
  const keys = getObjectKeys(resolutions)

  for (const key of keys) {
    const res = resolutions[key]

    if (res.width === width && res.height === height) {
      return key
    }
  }

  return null
}
