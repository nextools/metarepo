import { globalObject } from './global-object'

export const platformId = globalObject.navigator.userAgent
export const isSafari = !platformId.includes('Chrome') && platformId.includes('Safari')
