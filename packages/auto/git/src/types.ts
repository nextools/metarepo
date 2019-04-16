import { TBumpType } from '@auto/utils'

export type TGitOptions = {
  initialType: TBumpType,
}

export type TParsedMessageType = TBumpType | 'publish' | 'initial'

export type TRepoParsedMessage = {
  type: TParsedMessageType,
  message: string,
}

export type TWorkspacesParsedMessage = {
  names: string[],
} & TRepoParsedMessage
