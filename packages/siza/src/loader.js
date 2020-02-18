export default (src) => [
  src,
  'require(\'react-dom\').render(require(\'react\').createElement(App), document.getElementById(\'root\'))',
].join('\n')
