import {
  CheckChromeScreenshots,
  CheckFirefoxScreenshots,
  CheckAndroidScreenshots,
  CheckIosScreenshots,
} from '@bubble-dev/start-preset'

export * from '@bubble-dev/start-preset'

// custom tasks:
export const checkChromeScreenshots = CheckChromeScreenshots()
export const checkFirefoxScreenshots = CheckFirefoxScreenshots()
export const checkAndroidScreenshots = CheckAndroidScreenshots('.x-ray/')
export const checkIosScreenshots = CheckIosScreenshots('.x-ray/')
