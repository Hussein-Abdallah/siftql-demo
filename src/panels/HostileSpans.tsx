import { toSegments, SiftQLHighlight, type HighlightSpan } from '@siftql/react-highlighter';

import { Panel } from '../Panel';

const TEXT = 'Ada Lovelace';

/**
 * Spans nothing sane would produce, because nothing guarantees the offsets and
 * the string were computed from each other. A highlighter that throws takes the
 * screen down over decoration, so each of these has to survive.
 */
const CASES: readonly { readonly label: string; readonly spans: HighlightSpan[] }[] = [
  { label: 'out of order', spans: [{ start: 4, end: 8 }, { start: 0, end: 3 }] },
  { label: 'overlapping', spans: [{ start: 0, end: 5 }, { start: 3, end: 8 }] },
  { label: 'touching', spans: [{ start: 0, end: 2 }, { start: 2, end: 4 }] },
  { label: 'reversed', spans: [{ start: 8, end: 4 }] },
  { label: 'empty', spans: [{ start: 4, end: 4 }] },
  { label: 'negative start', spans: [{ start: -5, end: 3 }] },
  { label: 'past the end', spans: [{ start: 8, end: 9999 }] },
  { label: 'entirely past the end', spans: [{ start: 500, end: 900 }] },
];

export const HostileSpans = () => (
  <Panel
    title="Spans that do not describe the string"
    lede="Clamped or dropped, never thrown on — and the runs always concatenate back to the original exactly."
  >
    <table>
      <thead>
        <tr>
          <th>input</th>
          <th>spans</th>
          <th>renders</th>
          <th>concat === text</th>
        </tr>
      </thead>
      <tbody>
        {CASES.map((testCase) => {
          const segments = toSegments(TEXT, testCase.spans);
          const restored = segments.map((segment) => segment.text).join('') === TEXT;

          return (
            <tr key={testCase.label}>
              <td className="small">{testCase.label}</td>
              <td className="mono small">
                {testCase.spans.map((span) => `[${span.start}, ${span.end})`).join(' ')}
              </td>
              <td>
                <SiftQLHighlight text={TEXT} spans={testCase.spans} />
              </td>
              <td className={restored ? 'ok' : 'bad'}>{restored ? 'yes' : 'NO'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </Panel>
);
