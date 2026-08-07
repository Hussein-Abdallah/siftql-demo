import { SiftQLHighlight } from '@siftql/react-highlighter';

import { Panel } from '../Panel';

const TEXT = 'İstanbul office rollout';

const STATES = [
  {
    prop: 'spans={[{ start: 9, end: 15 }]}',
    spans: [{ start: 9, end: 15 }],
    means: 'These offsets matched. Mark them.',
  },
  {
    prop: 'spans={null}',
    spans: null,
    means: 'This value is why the row matched, but no substring of it is.',
  },
  {
    prop: 'spans={undefined}',
    spans: undefined,
    means: 'This value is not why the row matched. Render it plainly.',
  },
] as const;

export const ThreeStates = () => (
  <Panel
    title="Three states, not two"
    lede="A missing lookup and a match with nothing to point at are different facts, and the prop distinguishes them."
  >
    <table>
      <thead>
        <tr>
          <th>prop</th>
          <th>renders</th>
          <th>means</th>
        </tr>
      </thead>
      <tbody>
        {STATES.map((state) => (
          <tr key={state.prop}>
            <td className="mono small">{state.prop}</td>
            <td>
              <SiftQLHighlight text={TEXT} spans={state.spans} />
            </td>
            <td className="small">{state.means}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <p>
      The collapse happens at the boundary: siftql signals the middle state by omitting <code>ranges</code>,
      and a missed <code>Map.get</code> is also <code>undefined</code>. One of them has to become{' '}
      <code>null</code> on the way to the component, which is what <code>ranges ?? null</code> is doing in
      the hook.
    </p>
  </Panel>
);
