import { objectHas } from 'tsfn'
import { globalObject } from './global-object'

export const platformId = objectHas(globalObject, 'navigator') ? globalObject.navigator.userAgent : ''
export const isSafari = !platformId.includes('Chrome') && platformId.includes('Safari')
