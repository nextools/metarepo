export default (luminance1: number, luminance2: number): number => (
  luminance1 >= luminance2
    ? (luminance1 + 0.05) / (luminance2 + 0.05)
    : (luminance2 + 0.05) / (luminance1 + 0.05)
)
