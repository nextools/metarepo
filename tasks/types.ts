import type { TAnyObject } from 'tsfn'

export type TFile = {
  path: string,
  data: string,
  // TODO: find correct type
  map?: TAnyObject,
}
