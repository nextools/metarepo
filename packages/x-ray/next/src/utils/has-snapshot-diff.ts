export const hasSnapshotDiff = (snapshotA: Buffer, snapshotB: Buffer): boolean => {
  return Buffer.compare(snapshotA, snapshotB) !== 0
}
