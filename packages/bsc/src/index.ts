const binarySearch = <A, B>(arr: A[], key: B, comparator: (key: B, mid: A) => number) => {
  let start = 0
  let end = arr.length - 1

  while (start <= end) {
    const mid = Math.floor((start + end) / 2)
    const cmp = comparator(key, arr[mid])

    if (cmp < 0) {
      end = mid - 1
      continue
    }

    if (cmp > 0) {
      start = mid + 1
      continue
    }

    return mid
  }

  return -1
}

export default binarySearch
