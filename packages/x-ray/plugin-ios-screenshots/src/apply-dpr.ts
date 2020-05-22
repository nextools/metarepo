export const ApplyDpr = (dpr: number) => (size: number): number => Math.round(size / dpr * 100) / 100
