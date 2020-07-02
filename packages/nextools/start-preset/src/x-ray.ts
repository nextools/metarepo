import plugin from '@start/plugin'
import find from '@start/plugin-find'
import sequence from '@start/plugin-sequence'
import { xRay } from '@x-ray/core'
import { TAndroidScreenshotsOptions } from '@x-ray/plugin-android-screenshots'
import { TChromiumScreenshotsOptions } from '@x-ray/plugin-chromium-screenshots'
import { TIosScreenshotsOptions } from '@x-ray/plugin-ios-screenshots'
import { TReactNativeSnapshotsOptions } from '@x-ray/plugin-react-native-snapshots'
import { TReactSnapshotsOptions } from '@x-ray/plugin-react-snapshots'

export const CheckChromiumScreenshots = (options?: TChromiumScreenshotsOptions) => async (component = '**') => {
  const { chromiumScreenshots } = await import('@x-ray/plugin-chromium-screenshots')
  const xRayChromiumScreenshots = xRay(chromiumScreenshots(options))

  return sequence(
    find(`packages/${component}/x-ray/screenshots.tsx`),
    plugin('x-ray', () => ({ files }) => xRayChromiumScreenshots(
      files.map((file) => file.path)
    ))
  )
}

export const CheckIosScreenshots = (options?: TIosScreenshotsOptions) => async (component = '**') => {
  const { iOsScreenshots } = await import('@x-ray/plugin-ios-screenshots')
  const xRayIosScreenshots = xRay(iOsScreenshots(options))

  return sequence(
    find(`packages/${component}/x-ray/screenshots.tsx`),
    plugin('x-ray', () => ({ files }) => xRayIosScreenshots(
      files.map((file) => file.path)
    ))
  )
}

export const CheckAndroidScreenshots = (options?: TAndroidScreenshotsOptions) => async (component = '**') => {
  const { androidScreenshots } = await import('@x-ray/plugin-android-screenshots')
  const xRayAndroidScreenshots = xRay(androidScreenshots(options))

  return sequence(
    find(`packages/${component}/x-ray/screenshots.tsx`),
    plugin('x-ray', () => ({ files }) => xRayAndroidScreenshots(
      files.map((file) => file.path)
    ))
  )
}

export const CheckReactSnapshots = (options?: TReactSnapshotsOptions) => async (component = '**') => {
  const { reactSnapshots } = await import('@x-ray/plugin-react-snapshots')
  const xRayReactSnapshots = xRay(reactSnapshots(options))

  return sequence(
    find(`packages/${component}/x-ray/snapshots.tsx`),
    plugin('x-ray', () => ({ files }) => xRayReactSnapshots(
      files.map((file) => file.path)
    ))
  )
}

export const CheckReactNativeSnapshots = (options?: TReactNativeSnapshotsOptions) => async (component = '**') => {
  const { reactNativeSnapshots } = await import('@x-ray/plugin-react-native-snapshots')
  const xRayReactNativeSnapshots = xRay(reactNativeSnapshots(options))

  return sequence(
    find(`packages/${component}/x-ray/snapshots.tsx`),
    plugin('x-ray', () => ({ files }) => xRayReactNativeSnapshots(
      files.map((file) => file.path)
    ))
  )
}
