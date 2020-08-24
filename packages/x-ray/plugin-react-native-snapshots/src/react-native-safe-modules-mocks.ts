export const ReactNativeSafeModulesMocks = new Proxy({}, {
  get() {
    return {
      create: (options: any) => options,
      component: (options: any) => options.mockComponent,
      module: (options: any) => options,
    }
  },
})
