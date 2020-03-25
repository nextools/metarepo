exports.test = (arg) => (item) => {
  if (item === 13) {
    return Promise.reject(new Error('oops'))
  }

  return Promise.resolve({ value: item + arg })
}
