export const normalizeBlockId = (blockId: string): string => {
  return `${blockId.substr(0, 8)}-${blockId.substr(8, 4)}-${blockId.substr(12, 4)}-${blockId.substr(16, 4)}-${blockId.substr(20)}`
}
