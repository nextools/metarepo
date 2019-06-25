import { TBumpType } from '@auto/utils'

export type TGitOptions = {
  initialType: TBumpType,
}

export type TParsedMessageType = TBumpType | 'publish' | 'initial'

export type TParsedMessage = {
  type: TParsedMessageType,
  message: string,
  names: string[],
}
