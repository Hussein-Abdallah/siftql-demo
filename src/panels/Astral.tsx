import { highlight } from '@siftql/core';
import { toSegments, SiftQLHighlight } from '@siftql/react-highlighter';

import { ROWS } from '../data';
import { Panel } from '../Panel';

const ROW = ROWS[3]!;
const TEXT = ROW.title;

const WHOLE = [{ start: 5, end: 7 }];
const SPLIT = [{ start: 5, end: 6 }];

export const Astral = () => {
  const fromEngine = highlight('title:*🚀*', ROW)[0];
  const splitSegments = toSegments(TEXT, SPLIT);
  const restored = splitSegments.map((segment) => segment.text).join('') === TEXT;

  return (
    <Panel
      title="Offsets are UTF-16 code units"
      lede="The same units String.prototype.slice uses, which is what makes rendering a matter of slicing rather than of counting."
    >
      <p className="mono small">
        {JSON.stringify(TEXT)} — length {TEXT.length}, {[...TEXT].length} characters
      </p>

      <table>
        <thead>
          <tr>
            <th>spans</th>
            <th>renders</th>
            <th>concat === text</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="mono small">[5, 7) — the whole pair</td>
            <td>
              <SiftQLHighlight text={TEXT} spans={WHOLE} />
            </td>
            <td className="ok">yes</td>
          </tr>
          <tr>
            <td className="mono small">[5, 6) — splits the pair</td>
            <td>
              <SiftQLHighlight text={TEXT} spans={SPLIT} />
            </td>
            <td className={restored ? 'ok' : 'bad'}>{restored ? 'yes' : 'NO'}</td>
          </tr>
        </tbody>
      </table>

      <p>
        The second row is the honest part. A span that ends between the two halves of a surrogate pair
        leaves a lone surrogate in each segment, and the browser draws each as a replacement character. The
        concatenation invariant still holds — nothing is dropped or duplicated — but what you see is not
        what the string says.
      </p>

      <p>
        The engine does not do this to you. Asking for <code className="mono">title:*🚀*</code> returns{' '}
        <code className="mono">{JSON.stringify(fromEngine?.ranges)}</code>, the whole pair. A split can only
        arrive from offsets computed somewhere else — which is exactly the case the component is built to
        survive rather than to trust.
      </p>
    </Panel>
  );
};
