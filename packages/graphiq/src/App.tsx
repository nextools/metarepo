import { Background } from '@revert/background'
import { Layout_Item, Layout } from '@revert/layout'
import { Root } from '@revert/root'
import {
  component,
  mapDebouncedHandlerTimeout,
  mapHandlers,
  mapState,
  startWithType,
  onUpdate,
} from 'refun'
import { Canvas } from './Canvas'
import { Footer } from './Footer'
import { Header } from './Header'
import { PAGE_BACKGROUND_COLOR, CONTROLS_HEIGHT_TOP, CONTROLS_HEIGHT_BOTTOM, CANVAS_PADDING } from './constants'
import type { TGraphEntry } from './types'
import { globalObject, getHash, updateHash } from './utils'

export type TApp = {
  graphs: TGraphEntry[],
}

export const App = component(
  startWithType<TApp>(),
  mapState('monthsAgo', 'setMonthsAgo', () => 1, []),
  mapState('selectedGraph', 'setSelectedGraph', ({ graphs }) => getHash(graphs), []),
  mapState('hoveredGraph', 'setHoveredGraph', () => null as string | null, []),
  mapHandlers({
    onSelectMonths: ({ setMonthsAgo }) => (months) => {
      setMonthsAgo(months)
    },
    onSelectGraph: ({ selectedGraph, setSelectedGraph, setHoveredGraph }) => (name: string) => {
      if (selectedGraph !== name) {
        setSelectedGraph(name)
        setHoveredGraph(name)
      }
    },
    onShowAllGraphs: ({ setSelectedGraph, setHoveredGraph }) => () => {
      setSelectedGraph(null)
      setHoveredGraph(null)
    },
    onHoverGraph: ({ selectedGraph, setHoveredGraph }) => (id) => {
      if (selectedGraph === null) {
        setHoveredGraph(id)
      }
    },
  }),
  onUpdate(({ graphs, setSelectedGraph, setHoveredGraph }) => {
    globalObject.addEventListener('hashchange', () => {
      const hash = getHash(graphs)

      setHoveredGraph(null)
      setSelectedGraph(hash)
      updateHash(hash)
    })
  }, []),
  onUpdate(({ selectedGraph }) => {
    updateHash(selectedGraph)
  }, ['selectedGraph']),
  mapDebouncedHandlerTimeout('onHoverGraph', 100)
)(({
  graphs,
  hoveredGraph,
  monthsAgo,
  selectedGraph,
  onHoverGraph,
  onSelectGraph,
  onShowAllGraphs,
  onSelectMonths,
}) => (
  <Root>
    <Layout direction="vertical">
      <Background color={PAGE_BACKGROUND_COLOR}/>

      <Layout_Item height={CONTROLS_HEIGHT_TOP}>
        <Header
          selectedMonths={monthsAgo}
          onSelectMonths={onSelectMonths}
        />
      </Layout_Item>

      <Layout_Item hPadding={CANVAS_PADDING}>
        <Canvas
          graphs={graphs}
          selectedMonths={monthsAgo}
          hoveredGraph={hoveredGraph}
          selectedGraph={selectedGraph}
          onHoverGraph={onHoverGraph}
          onSelectGraph={onSelectGraph}
        />
      </Layout_Item>

      <Layout_Item height={CONTROLS_HEIGHT_BOTTOM}>
        <Footer
          graphs={graphs}
          selectedGraph={selectedGraph}
          onSelectGraph={onSelectGraph}
          onShowAllGraphs={onShowAllGraphs}
        />
      </Layout_Item>
    </Layout>
  </Root>
))

App.displayName = 'App'
