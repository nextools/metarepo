/* eslint-disable import/no-extraneous-dependencies */
// import { Background } from '@revert/background'
// import { PrimitiveBackground } from '@revert/background'
// import { Block } from '@revert/block'
// import { Border, PrimitiveBorder } from '@revert/border'
// import { Button } from '@revert/button'
// import { Checkbox } from '@revert/checkbox'
// import { rgba } from '@revert/color'
// import type { TColor } from '@revert/color'
// import { PrimitiveImage } from '@revert/image'
// import { Input } from '@revert/input'
// import type { TInput } from '@revert/input'
// import { Label } from '@revert/label'
// import { Layout, Layout_Item, LAYOUT_SIZE_FIT } from '@revert/layout'
// import { CreateMarkdownComponent, MarkdownThemeContext } from '@revert/markdown'
// import { Root } from '@revert/root'
// import { Scroll } from '@revert/scroll'
// import { Shadow } from '@revert/shadow'
// import { Size } from '@revert/size'
// import { Surface, Shape } from '@revert/svg'
// import type { TPrimitiveText } from '@revert/text'
// import { PrimitiveText, TextThemeContext } from '@revert/text'
// import { PrimitiveTextAlign } from '@revert/text-align'
// import { PrimitiveTransform } from '@revert/transform'
// import React from 'react'
// import type { FC } from 'react'
// import { component, startWithType, mapState, mapHandlers, mapWithProps, mapKeyboardFocused, mapDefaultContext, mapDefaultProps } from 'refun'
// import type { TMapKeyboardFocused } from 'refun'
// import type { TOmitKey } from 'tsfn'

// const TRANSPARENT = rgba(255, 255, 255, 0)
// const WHITE = rgba(255, 255, 255, 1)
// const BLACK = rgba(0, 0, 0, 1)

// const Icon: FC<{ d: string, size: number }> = ({ d, size }) => (
//   <Block width={size} height={size}>
//     <Surface width={size} height={size}>
//       <Shape d={d}/>
//     </Surface>
//   </Block>
// )

// const FixedHeight: FC<{ height: number }> = ({ height, children }) => (
//   <Layout direction="vertical">
//     <Layout_Item height={height}>
//       {children}
//     </Layout_Item>
//   </Layout>
// )

// const FitWidth: FC = ({ children }) => (
//   <Layout>
//     <Layout_Item width={LAYOUT_SIZE_FIT}>
//       {children}
//     </Layout_Item>
//   </Layout>
// )

// const CHK_ACTIVE_BG = rgba(0, 255, 0, 0.4)
// const CHK_BG = rgba(255, 255, 255, 1)
// const CHK_ACTIVE_BOR = rgba(255, 0, 0, 0.4)
// const CHK_BOR = rgba(0, 0, 0, 0.5)

// type TLayoutCheckbox = {
//   size: number,
//   children: string,
// } & TMapKeyboardFocused

// const LayoutCheckbox = component(
//   startWithType<TLayoutCheckbox>(),
//   mapState('isChecked', 'setChecked', () => false, []),
//   mapKeyboardFocused,
//   mapWithProps(({ isChecked, isKeyboardFocused }) => ({
//     d: isChecked
//       ? 'M10.215 1L4.292 8.558 1.414 5.68 0 7.094l3.676 3.676a1 1 0 00.707.293l.06-.002c.286-.018.55-.157.727-.381l6.619-8.446L10.215 1z'
//       : '',
//     backgroundColor: isChecked ? CHK_ACTIVE_BG : CHK_BG,
//     borderColor: isChecked ? CHK_ACTIVE_BOR : CHK_BOR,
//     keyboardColor: isKeyboardFocused ? CHK_ACTIVE_BOR : TRANSPARENT,
//   })),
//   mapHandlers({
//     onToggle: ({ isChecked, setChecked }) => () => {
//       setChecked(!isChecked)
//     },
//   })
// )(({
//   d,
//   size,
//   backgroundColor,
//   borderColor,
//   keyboardColor,
//   children,
//   isChecked,
//   onToggle,
//   onBlur,
//   onFocus,
//   onPressIn,
//   onPressOut,
// }) => (
//   <FitWidth>
//     <FixedHeight height={size}>
//       <Border color={keyboardColor} borderWidth={4} overflow={6} radius={14}/>
//       <Checkbox isChecked={isChecked} onToggle={onToggle} onBlur={onBlur} onFocus={onFocus} onPressIn={onPressIn} onPressOut={onPressOut}>
//         <Layout>
//           <Layout_Item width={size}>
//             <Background color={backgroundColor} radius={10}/>
//             <Border color={borderColor} borderWidth={2} radius={10}/>
//             <Layout>
//               <Layout_Item hAlign="center" vAlign="center">
//                 <Icon d={d} size={12}/>
//               </Layout_Item>
//             </Layout>
//           </Layout_Item>
//           <Layout_Item vAlign="center" hPadding={10}>
//             <Text>{children}</Text>
//           </Layout_Item>
//         </Layout>
//       </Checkbox>
//     </FixedHeight>
//   </FitWidth>
// ))

// /* BUTTON */

// type TLayoutButton = {
//   backgroundColor?: TColor,
//   borderColor?: TColor,
// }

// const LayoutButton = component(
//   startWithType<TLayoutButton>(),
//   mapState('state', 'setState', () => false, []),
//   mapHandlers({
//     onPress: ({ state, setState }) => () => {
//       setState(!state)
//     },
//   }),
//   mapWithProps(({ state }) => ({
//     // btnText: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam tenetur dolorem magnam maxime possimus nobis hic officia, laborum, obcaecati soluta eos minima, quis deleniti natus quam sequi ipsum autem animi!',
//     // btnText: 'button',
//     btnText: state
//       ? 'Loremipsumdolorsit, ametconsecteturadipi sicingelit. Culpa maiores quaerat cupiditate. Error,eaquedistinctio!Aliquid'
//       : 'button',
//   }))
// )(({
//   backgroundColor = rgba(0, 0, 255, 0.2),
//   borderColor = rgba(255, 0, 0, 0.4),
//   state,
//   btnText,
//   onPress,
// }) => (
//   <Layout>
//     <Background color={backgroundColor} radius={10}/>
//     <Border color={borderColor} borderWidth={2} radius={10}/>
//     <Shadow color={borderColor} blurRadius={10} radius={10}/>
//     <Layout_Item hAlign="center" vAlign="center" hPadding={20} vPadding={20}>
//       <Button onPress={onPress}>
//         <Size>

//           <PrimitiveText>
//             {btnText}
//           </PrimitiveText>

//           <PrimitiveImage width={32} height={32} source="https://funkyimg.com/i/37i9q.png"/>

//           <PrimitiveText>
//             {btnText}
//           </PrimitiveText>

//         </Size>
//       </Button>
//     </Layout_Item>
//   </Layout>
// ))

// LayoutButton.displayName = 'LayoutButton'

// /* INPUT */

// const LayoutInput = component(
//   startWithType<TOmitKey<TInput, 'value' | 'onChange'>>(),
//   mapState('value', 'setValue', () => 'Input text', [])
// )(({ value, setValue, ...props }) => (
//   <Block minWidth={100} height={40}>
//     <Background color={WHITE} radius={10}/>
//     <Border color={BLACK} borderWidth={2} radius={10}/>
//     <Shadow color={BLACK} blurRadius={2} radius={10}/>
//     <Input
//       paddingLeft={10}
//       paddingRight={10}
//       {...props}
//       value={value}
//       onChange={setValue}
//     />
//   </Block>
// ))

// LayoutInput.displayName = 'LayoutInput'

// export const App: FC<{}> = () => (
//   <Block width={220} height={400}>
//     <Layout>
//       <Background color={rgba(200, 100, 100, 0.5)}/>
//       <Layout_Item>
//         <LayoutButton/>
//       </Layout_Item>
//     </Layout>
//   </Block>
// )

// const BG: FC = () => (
//   <Background color={rgba(78, 90, 39, 1)}/>
// )

// const Cont: FC = () => {
//   const [state, setState] = useState(0)

//   return (
//     <Layout direction="horizontal">

//       <Layout_Item key="panel" hPadding={20} vPadding={20} minWidth={200}>
//         <BG/>
//       </Layout_Item>
//       <Layout_Resize width={20}>
//         <Background color={rgba(128, 128, 0, 1)}/>
//       </Layout_Resize>
//       <Layout_Item maxWidth={state === 0 ? 200 : UNDEFINED}>
//         <Background color={rgba(state === 0 ? 255 : 78, 90, 39, 1)}/>
//         <Button onPress={() => setState(state === 0 ? 1 : 0)}>
//           <Text>Click</Text>
//         </Button>
//       </Layout_Item>
//       <Layout_Resize width={20}>
//         <Background color={rgba(128, 128, 0, 1)}/>
//       </Layout_Resize>
//       <Layout_Item hPadding={20} vPadding={20} minWidth={200}>
//         <BG/>
//       </Layout_Item>
//     </Layout>
//   )
// }

// export const App: FC<{}> = () => {
//   return (
//     <Root>
//       <PortalProvider>
//         <Layout direction="vertical">
//           <Layout_Item key="panel" hPadding={20} vPadding={20}>
//             <BG/>
//           </Layout_Item>

//           <Layout_Resize height={20}>
//             <Background color={rgba(128, 0, 0, 1)}/>
//           </Layout_Resize>

//           <Layout_Item>
//             <Cont/>
//           </Layout_Item>

//           <Layout_Resize height={20}>
//             <Background color={rgba(128, 0, 0, 1)}/>
//           </Layout_Resize>

//           <Layout_Item hPadding={20} vPadding={20}>
//             <BG/>
//           </Layout_Item>
//         </Layout>
//       </PortalProvider>
//     </Root>
//   )
// }

// const src = `

// # v0.2.0 *asdasd* asdasd
// ## v0.2.0

// * 🌱 new button with only icon and button with text and icon has alignment and button level quaternary

// * 🐞 bumping packages touched by themeing

//   \`\`\`
//   Please enter the commit message for your changes. Lines starting
//   \`\`\`
//   asdasdsad asdasd

//   * sadads
//   *
//     \`\`\`
//     Please enter
//     \`\`\`
//   * _sdadsa_
// `

// const MdPrimitiveText = component(
//   startWithType<TPrimitiveText>(),
//   mapDefaultContext(TextThemeContext),
//   mapDefaultProps({
//     color: 0xff,
//     fontFamily: 'Helvetica, Arial, sans-serif',
//     fontWeight: 400,
//     fontSize: 16,
//     lineHeight: 20,
//   })
// )(PrimitiveText as any)

// MdPrimitiveText.displayName = PrimitiveText.displayName

// const MD = CreateMarkdownComponent({
//   PrimitiveBackground,
//   PrimitiveBorder,
//   PrimitiveText: MdPrimitiveText,
// })

// export const App: FC<{}> = () => (
//   <MarkdownThemeContext.Provider value={{
//     h1fontSize: 28,
//     h1lineHeight: 32,

//     h2fontSize: 22,
//     h2lineHeight: 26,

//     h3fontSize: 16,
//     h3lineHeight: 20,

//     fontSize: 16,
//     lineHeight: 20,

//     codeBackgroundColor: 0xff000044,
//   }}
//   >
//     <Block width={220} height={400}>
//       <Background color={rgba(200, 100, 100, 0.5)}/>
//       <Layout direction="vertical">
//         <Layout_Item height={LAYOUT_SIZE_FIT}>
//           <MD
//             source={src}
//           />
//         </Layout_Item>
//       </Layout>
//     </Block>
//   </MarkdownThemeContext.Provider>
// )

// const BG: FC = () => (
//   <Background color={rgba(78, 90, 39, 1)}/>
// )

// const Cont: FC = () => {
//   const [state, setState] = useState(0)

//   return (
//     <Layout direction="horizontal">

//       <Layout_Item key="panel" hPadding={20} vPadding={20} minWidth={200}>
//         <BG/>
//       </Layout_Item>
//       <Layout_Resize width={20}>
//         <Background color={rgba(128, 128, 0, 1)}/>
//       </Layout_Resize>
//       <Layout_Item maxWidth={state === 0 ? 200 : UNDEFINED}>
//         <Background color={rgba(state === 0 ? 255 : 78, 90, 39, 1)}/>
//         <Button onPress={() => setState(state === 0 ? 1 : 0)}>
//           <Text>Click</Text>
//         </Button>
//       </Layout_Item>
//       <Layout_Resize width={20}>
//         <Background color={rgba(128, 128, 0, 1)}/>
//       </Layout_Resize>
//       <Layout_Item hPadding={20} vPadding={20} minWidth={200}>
//         <BG/>
//       </Layout_Item>
//     </Layout>
//   )
// }

// export const App: FC<{}> = () => {
//   return (
//     <Root>
//       <PortalProvider>
//         <Layout direction="vertical">
//           <Layout_Item key="panel" hPadding={20} vPadding={20}>
//             <BG/>
//           </Layout_Item>

//           <Layout_Resize height={20}>
//             <Background color={rgba(128, 0, 0, 1)}/>
//           </Layout_Resize>

//           <Layout_Item>
//             <Cont/>
//           </Layout_Item>

//           <Layout_Resize height={20}>
//             <Background color={rgba(128, 0, 0, 1)}/>
//           </Layout_Resize>

//           <Layout_Item hPadding={20} vPadding={20}>
//             <BG/>
//           </Layout_Item>
//         </Layout>
//       </PortalProvider>
//     </Root>
//   )
// }

// export const App: FC<{}> = () => (
//   <Root>
//     <Layout direction="vertical" spaceBetween={20} hPadding={20} vPadding={20}>
//       {/* Header */}
//       <Layout_Item height={50}>
//         <Background color={rgba(78, 90, 39, 1)}/>
//       </Layout_Item>

//       {/* Middle section */}
//       <Layout_Item>
//         <Layout direction="horizontal" spaceBetween={20}>
//           <Layout_Item width={100}>
//             <Layout direction="vertical" spaceBetween={20}>
//               <Layout_Item>
//                 <Background color={rgba(103, 147, 58, 1)}/>
//               </Layout_Item>
//               <Layout_Item>
//                 <Background color={rgba(148, 139, 117, 1)}/>
//               </Layout_Item>
//             </Layout>
//           </Layout_Item>

//           <Layout_Item>
//             <Background color={rgba(252, 224, 167, 1)}/>
//             <Scroll shouldScrollVertically>
//               <Layout direction="vertical">
//                 <Layout_Item height={200} hAlign="center" vAlign="center">
//                   <LayoutButton
//                     borderColor={rgba(255, 0, 0, 0.4)}
//                     backgroundColor={rgba(0, 0, 255, 0.2)}
//                   />
//                 </Layout_Item>
//                 <Layout_Item height={200} hAlign="center" vAlign="center">
//                   <Background color={rgba(255, 0, 0, 0.4)}/>
//                   <LayoutInput/>
//                 </Layout_Item>
//               </Layout>
//             </Scroll>
//           </Layout_Item>

//           <Layout_Item width={100}>
//             <Background color={rgba(245, 211, 106, 1)}/>
//           </Layout_Item>
//         </Layout>
//       </Layout_Item>

//       {/* Footer */}
//       <Layout_Item height={100}>
//         <Background color={rgba(204, 200, 111, 1)}/>
//         <Layout>
//           <Layout_Item width={LAYOUT_SIZE_FIT} hPadding={20}>
//             <Background color={rgba(0, 0, 255, 0.2)}/>
//             <Label>
//               <LayoutCheckbox size={32}>
//                 Checkmark
//               </LayoutCheckbox>
//             </Label>
//           </Layout_Item>
//           <Layout_Item hAlign="center" hPadding={20}>
//             <Background color={rgba(0, 0, 255, 0.2)}/>
//             <LayoutCheckbox size={64}>
//               is enabled
//             </LayoutCheckbox>
//           </Layout_Item>
//         </Layout>
//       </Layout_Item>
//     </Layout>
//   </Root>
// )
