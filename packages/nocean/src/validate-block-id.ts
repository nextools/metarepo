const BLOCK_ID_LENGTH = 32

export const validateBlockId = (blockId: any) => {
  if (typeof blockId !== 'string' || blockId.length !== BLOCK_ID_LENGTH) {
    throw new Error(`Invalid \`blockId\` format, it must be ${BLOCK_ID_LENGTH} chars string`)
  }
}
