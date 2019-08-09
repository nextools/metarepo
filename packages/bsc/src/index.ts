const binarySearch = <T>(arr: T[], comparator: (item: T) => number) => {
  let start = 0
  let end = arr.length - 1

  while (start <= end) {
    const item = Math.floor((start + end) / 2)
    const cmp = comparator(arr[item])

    if (cmp < 0) {
      end = item - 1
      continue
    }

    if (cmp > 0) {
      start = item + 1
      continue
    }

    return item
  }

  return -1
}

export default binarySearch
