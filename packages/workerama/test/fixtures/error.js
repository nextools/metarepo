exports.test = (item, arg) => {
  if (item === 13) {
    return Promise.reject(new Error('oops'))
  }

  return Promise.resolve(item + arg)
}
