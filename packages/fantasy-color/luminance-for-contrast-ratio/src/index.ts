export default (targetContrast: number, otherLuminance: number): number => (
  otherLuminance >= 0.5
    ? ((otherLuminance + 0.05) / targetContrast) - 0.05
    : (targetContrast * (otherLuminance + 0.05)) - 0.05
)
