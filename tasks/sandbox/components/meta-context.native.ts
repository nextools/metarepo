// https://webpack.js.org/guides/dependency-management/#requirecontext
export const metaContext = (require as any).context('../../../packages/revert/', true, /^\.\/[^/]+\/meta\.tsx$/, 'sync')
