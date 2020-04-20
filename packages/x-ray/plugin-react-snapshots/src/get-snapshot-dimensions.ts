export const getSnapshotDimensions = (snapshot: string): { width: number, height: number } => {
  const lines = snapshot.split('\n')
  let width = 0

  for (const line of lines) {
    if (line.length > width) {
      width = line.length
    }
  }

  return {
    width,
    height: lines.length,
  }
}
