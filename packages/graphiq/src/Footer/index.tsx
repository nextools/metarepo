import { Layout, Layout_Item, LAYOUT_SIZE_FIT } from '@revert/layout'
import { Scroll } from '@revert/scroll'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import type { TGraphEntry } from '../types'
import { GraphControlButton } from './GraphControlButton'
import { ShowAllButton } from './ShowAllButton'
import { getLastDifference } from './utils'

export type TFooterControls = {
  graphs: TGraphEntry[],
  selectedGraph: string | null,
  onSelectGraph: (key: string) => void,
  onShowAllGraphs: () => void,
}

export const Footer = component(
  startWithType<TFooterControls>(),
  mapWithPropsMemo(({ graphs }) => ({
    graphDifferences: graphs.map(getLastDifference),
  }), ['graphs'])
)(({
  graphs,
  graphDifferences,
  selectedGraph,
  onSelectGraph,
  onShowAllGraphs,
}) => (
  <Layout direction="horizontal" spaceBetween={20} hPadding={20}>
    <Layout_Item>
      <Scroll shouldScrollHorizontally>
        <Layout direction="horizontal" spaceBetween={20} vPadding={25}>
          {graphs.map(({ graphName, colors }, i) => (
            <Layout_Item
              key={graphName}
            >
              <GraphControlButton
                colors={colors}
                selectedGraphName={selectedGraph}
                graphDiff={graphDifferences[i]}
                graphName={graphName}
                onSelectGraph={onSelectGraph}
              />
            </Layout_Item>
          ))}
        </Layout>
      </Scroll>
    </Layout_Item>

    <Layout_Item width={LAYOUT_SIZE_FIT} vPadding={25}>
      <ShowAllButton onShowAllGraphs={onShowAllGraphs}/>
    </Layout_Item>
  </Layout>
))

Footer.displayName = 'Footer'
Footer.componentSymbol = Symbol('FOOTER')
