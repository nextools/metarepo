exports.test = (arg) => (item) => {
  if (!item.done) {
    if (item.value === 13) {
      return Promise.reject(new Error('oops'))
    }

    return Promise.resolve({ value: item.value + arg })
  }
}
