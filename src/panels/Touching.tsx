import { SiftQLHighlight } from '@siftql/react-highlighter';

import { Panel } from '../Panel';

const TEXT = 'Ada Lovelace';

/**
 * Deliberately a styled mark rather than a plain background, because with a flat
 * opaque fill the merged and unmerged renderings are pixel-identical and the
 * panel would argue against itself. A border is what makes the join visible —
 * two adjacent marks draw two edges where one run draws none, which is a real
 * styling choice (outlined chips, bordered tags) and not a contrivance.
 */
const MARK = {
  background: 'rgba(56, 132, 255, 0.28)',
  border: '1px solid rgba(56, 132, 255, 0.9)',
  borderRadius: '3px',
  padding: '0 2px',
} as const;

export const Touching = () => (
  <Panel
    title="Touching spans merge"
    lede="[0, 2) and [2, 4) describe one run of four characters, and are rendered as one <mark>."
  >
    <table>
      <thead>
        <tr>
          <th>rendered by</th>
          <th>output</th>
          <th>&lt;mark&gt; elements</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="small">two adjacent marks, unmerged</td>
          <td>
            <span style={{ fontSize: '1.4rem' }}>
              <mark style={MARK}>{TEXT.slice(0, 2)}</mark>
              <mark style={MARK}>{TEXT.slice(2, 4)}</mark>
              {TEXT.slice(4)}
            </span>
          </td>
          <td className="mono small">2</td>
        </tr>
        <tr>
          <td className="small">
            <code>SiftQLHighlight</code>
          </td>
          <td>
            <span style={{ fontSize: '1.4rem' }}>
              <SiftQLHighlight
                text={TEXT}
                spans={[
                  { start: 0, end: 2 },
                  { start: 2, end: 4 },
                ]}
                markStyle={MARK}
              />
            </span>
          </td>
          <td className="mono small">1</td>
        </tr>
      </tbody>
    </table>

    <p>
      Both select and copy as one word, so the difference is purely what you see: the unmerged pair draws
      two inner edges in the middle of <code>Ada&nbsp;</code>, splitting one match into what looks like two.
      Under a flat opaque background the two renderings are pixel-identical and none of this matters — it
      is bordered, translucent and padded marks where it shows, which is why the merge happens at the
      segment layer rather than being left to whoever styles the <code>&lt;mark&gt;</code>.
    </p>
  </Panel>
);
