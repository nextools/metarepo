import plugin from '@start/plugin'
import find from '@start/plugin-find'
import sequence from '@start/plugin-sequence'
import type { TAndroidScreenshotsOptions } from '@x-ray/plugin-android-screenshots'
import type { TChromiumScreenshotsOptions } from '@x-ray/plugin-chromium-screenshots'
import type { TIosScreenshotsOptions } from '@x-ray/plugin-ios-screenshots'
import type { TReactNativeSnapshotsOptions } from '@x-ray/plugin-react-native-snapshots'
import type { TReactSnapshotsOptions } from '@x-ray/plugin-react-snapshots'

export const CheckChromiumScreenshots = (options?: TChromiumScreenshotsOptions) => async (component = '**') => {
  const { chromiumScreenshots } = await import('@x-ray/plugin-chromium-screenshots')
  const { xRay } = await import('@x-ray/core')
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
  const { xRay } = await import('@x-ray/core')
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
  const { xRay } = await import('@x-ray/core')
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
  const { xRay } = await import('@x-ray/core')
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
  const { xRay } = await import('@x-ray/core')
  const xRayReactNativeSnapshots = xRay(reactNativeSnapshots(options))

  return sequence(
    find(`packages/${component}/x-ray/snapshots.tsx`),
    plugin('x-ray', () => ({ files }) => xRayReactNativeSnapshots(
      files.map((file) => file.path)
    ))
  )
}
