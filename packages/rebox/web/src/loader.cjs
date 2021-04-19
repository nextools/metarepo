const { getOptions } = require('loader-utils')

module.exports = function(src) {
  // eslint-disable-next-line no-invalid-this
  const options = getOptions(this)
  const props = JSON.stringify(options.props)

  return [
    src,
    `require('react-dom').render(require('react').createElement(App, JSON.parse('${props}')), document.getElementById('root'))`,
  ].join('\n')
}
