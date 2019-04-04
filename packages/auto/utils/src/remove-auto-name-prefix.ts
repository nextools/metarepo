export const removeAutoNamePrefix = (name: string, autoNamePrefix: string) => {
  return name.replace(new RegExp(`^${autoNamePrefix}`), '')
}
