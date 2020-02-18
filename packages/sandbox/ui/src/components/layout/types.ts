import { LAYOUT_SIZE_1, LAYOUT_SIZE_2, LAYOUT_SIZE_3, LAYOUT_SIZE_4, LAYOUT_SIZE_FIT } from '../../symbols'

export type TLayoutSize = number | typeof LAYOUT_SIZE_1 | typeof LAYOUT_SIZE_2 | typeof LAYOUT_SIZE_3 | typeof LAYOUT_SIZE_4 | typeof LAYOUT_SIZE_FIT
export type TLayoutDirection = 'horizontal' | 'vertical'
