import { ChangeEvent, ReactElement } from 'react'
import { TColor } from 'colorido'
import { TEasingFn } from '@primitives/animation'

export type TEntry = {
  version: string,
  value: number,
  timestamp: number,
}

export type TGraph = {
  key: string,
  colors: [TColor, TColor],
  values: TEntry[],
}

export type TPoint = {
  x: number,
  y: number,
}

export type TRect = {
  x: number,
  y: number,
  width: number,
  height: number,
}

export type TGraphControl = {
  colors: [TColor, TColor],
  key: string,
  lastDifference: number,
  name: string,
}

export type TButton = {
  idKey: string,
  selectedGraph: string | null,
  onSelectGraph: (key: string | null) => void,
} & TGraphControl

export type TCanvas = {
  graphs: TGraph[],
  height: number,
  hoveredGraph: string | null,
  monthsAgo: number,
  scale: number,
  selectedGraph: string | null,
  width: number,
  onHoverGraph: (key: string | null) => void,
  onSelectGraph: (key: string | null) => void,
  onSliderChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

export type THeaderControls = {
  monthsAgo: number,
  onMonthsAgo: (key: number) => void,
}

export type TFooterControls = {
  graphControls: TGraphControl[],
  selectedGraph: string | null,
  width: number,
  onSelectGraph: (key: string | null) => void,
}

export type TGraphItem = {
  colors: TColor[],
  entries: TEntry[],
  height: number,
  id: string,
  isActive: boolean,
  isHovered: boolean,
  monthsAgo: number,
  scale: number,
  width: number,
  onHover: (key: string | null) => void,
  onSelect: (key: string) => void,
}

export type TApp = {
  graphs: TGraph[],
}

type TGraphPoint = {
  x: number,
  y: number,
  value: number,
  version: string,
}

export type TGraphPoints = {
  isActive: boolean,
  fill: TColor,
  points: TGraphPoint[],
  onPointerEnter: (id: string) => void,
  onPointerLeave: () => void,
}

export type TGraphPolygon = {
  colors: TColor[],
  id: string,
  isActive: boolean,
  points: string,
}

export type TTooltip = {
  isActive: boolean,
  version: string,
  value: number,
  valueDifference: number,
  x: number,
  y: number,
  viewportRight: number,
  viewportTop: number,
}

export type TGraphPath = {
  colors: TColor[],
  id: string,
  isActive: boolean,
  points: string,
  onHover: (key: string | null) => void,
  onSelect: (key: string) => void,
}

export type TGraphTooltips = {
  activePoint: string | null,
  isActive: boolean,
  points: TGraphPoint[],
  width: number,
}

export type TAnimate = {
  from: number,
  to: number,
  time: number,
  easing: TEasingFn,
  isActive: boolean,
  children: (arg: [number]) => ReactElement,
}
