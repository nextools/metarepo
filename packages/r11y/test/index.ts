import test from 'tape'
import { getA11yData } from '../src'

test('r11y: getA11yData', async (t) => {
  const result = await getA11yData({
    entryPointPath: require.resolve('./fixtures/App'),
  })

  t.deepEqual(
    result,
    {
      errors: [
        { rule: 'color-contrast', path: 'Field', tag: 'input', attrs: {} },
      ],
      navigationFlow: [
        { path: 'Field', tag: 'input', attrs: {} },
        { path: 'Button > div', tag: 'div', attrs: { role: 'button', 'aria-pressed': 'false' } },
      ],
    },
    'should work'
  )
})
