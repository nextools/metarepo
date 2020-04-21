import test from 'tape'
import { rgba, colorToString, redChannel, greenChannel, blueChannel, alphaChannel, isColor } from '../src'

test('revert/color: rgba', (t) => {
  t.equals(rgba(0, 0, 0, 0), 0)
  t.equals(rgba(0, 0, 0, 0.1), 0x1a)
  t.equals(rgba(0, 0, 0, 0.2), 0x33)
  t.equals(rgba(0, 0, 0, 0.33), 0x54)
  t.equals(rgba(0, 0, 0, 0.4), 0x66)
  t.equals(rgba(0, 0, 0, 0.5), 0x80)
  t.equals(rgba(0, 0, 0, 0.9), 0xe6)
  t.equals(rgba(0, 0, 0, 0.99), 0xfc)
  t.equals(rgba(255, 255, 255, 0), 0xffffff00)
  t.equals(rgba(128, 128, 128, 0.5), 0x80808080)
  t.equals(rgba(0, 0, 0.6, 0), 0x00000100)

  t.end()
})

test('revert/color: redChannel', (t) => {
  t.equals(redChannel(0x0), 0x0)
  t.equals(redChannel(0xff), 0x0)
  t.equals(redChannel(0xff0000ff), 0xff)
  t.equals(redChannel(0x800000ff), 0x80)

  t.end()
})

test('revert/color: greenChannel', (t) => {
  t.equals(greenChannel(0x0), 0x0)
  t.equals(greenChannel(0xff), 0x0)
  t.equals(greenChannel(0x00ff00ff), 0xff)
  t.equals(greenChannel(0x008000ff), 0x80)

  t.end()
})

test('revert/color: blueChannel', (t) => {
  t.equals(blueChannel(0x0), 0x0)
  t.equals(blueChannel(0xff), 0x0)
  t.equals(blueChannel(0x0000ffff), 0xff)
  t.equals(blueChannel(0x000080ff), 0x80)

  t.end()
})

test('revert/color: alphaChannel', (t) => {
  t.equals(alphaChannel(0x0), 0)
  t.equals(alphaChannel(0x1a), 0.1)
  t.equals(alphaChannel(0x33), 0.2)
  t.equals(alphaChannel(0x54), 0.33)
  t.equals(alphaChannel(0x66), 0.4)
  t.equals(alphaChannel(0x80), 0.5)
  t.equals(alphaChannel(0xe6), 0.9)
  t.equals(alphaChannel(0xff), 1)

  t.end()
})

test('revert/color: color to string', (t) => {
  t.equals(colorToString(0x0), 'rgba(0, 0, 0, 0)')
  t.equals(colorToString(0x1a), 'rgba(0, 0, 0, 0.1)')
  t.equals(colorToString(0x33), 'rgba(0, 0, 0, 0.2)')
  t.equals(colorToString(0x54), 'rgba(0, 0, 0, 0.33)')
  t.equals(colorToString(0x66), 'rgba(0, 0, 0, 0.4)')
  t.equals(colorToString(0x80), 'rgba(0, 0, 0, 0.5)')
  t.equals(colorToString(0xe6), 'rgba(0, 0, 0, 0.9)')
  t.equals(colorToString(0xfc), 'rgba(0, 0, 0, 0.99)')
  t.equals(colorToString(0xff), 'rgba(0, 0, 0, 1)')
  t.equals(colorToString(0xffff), 'rgba(0, 0, 255, 1)')
  t.equals(colorToString(0xffffff), 'rgba(0, 255, 255, 1)')
  t.equals(colorToString(0xffffffff), 'rgba(255, 255, 255, 1)')
  t.equals(colorToString(0xff00ff00), 'rgba(255, 0, 255, 0)')

  t.end()
})

test('revert/color: isColor', (t) => {
  t.true(isColor(0xff))
  t.false(isColor('0xff'))

  t.end()
})
