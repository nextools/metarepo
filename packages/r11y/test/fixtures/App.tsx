const Field = () => (
  <input style={{ opacity: 0.1 }} value="input"/>
)

Field.displayName = 'Field'

const Button = () => (
  <div>
    <div role="button" aria-pressed={false} tabIndex={0}>button</div>
  </div>
)

Button.displayName = 'Button'

export const App = () => (
  <div>
    <Field/>
    <Button/>
  </div>
)
