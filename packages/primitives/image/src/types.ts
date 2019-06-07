export type TImage = {
  id?: string,
  alt?: string,
  source: string,
  height: number,
  width: number,
  borderRadius?: number,
  resizeMode?: 'contain' | 'cover',
}
