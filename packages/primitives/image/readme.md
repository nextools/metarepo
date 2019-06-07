`Image` is an element that allowed to render an image. 
Only the image scaling can be styled.

These map to the same corresponding props in Web and in React Native.

## Raw type definitions

```ts
export type TImage = {
  id?: string,
  alt?: string,
  source: string,
  height: number,
  width: number,
  borderRadius?: number,
}

export type TImageWeb = {
  resizeMode?: string
}

export type TImageNative = {
  resizeMode?: ImageResizeMode,
}

```

