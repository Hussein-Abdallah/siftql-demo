import { highlight } from '@siftql/core';
import { SiftQLHighlight } from '@siftql/react-highlighter';

import { ROWS } from '../data';
import { Panel } from '../Panel';
import { WHOLE_VALUE_STYLE } from '../marks';

const QUERY = 'title:*office*';

/** Everything on screen is computed here, so no caption can drift from it. */
const inspect = (row: (typeof ROWS)[number]) => {
  const hit = highlight(QUERY, row)[0];

  return {
    row,
    matched: hit !== undefined,
    // The distinction the three-state model exists for: `ranges` ABSENT is not
    // the same as no match. `?? null` is where absent becomes the null state.
    spans: hit === undefined ? undefined : (hit.ranges ?? null),
    raw: hit === undefined ? '[]' : JSON.stringify(hit),
  };
};

export const CaseFolding = () => {
  const dotted = inspect(ROWS[1]!);
  const ascii = inspect(ROWS[2]!);
  const folded = 'İ'.toLowerCase();

  return (
    <Panel
      title="Why “matched” and “where” are different answers"
      lede="One query, two rows, one character of difference. This is the case the third state exists for."
    >
      <p className="mono small">{QUERY}</p>

      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>painted</th>
            <th>highlight() returned</th>
          </tr>
        </thead>
        <tbody>
          {[dotted, ascii].map((result) => (
            <tr key={result.row.id}>
              <td className="mono small">{result.row.title}</td>
              <td>
                <SiftQLHighlight
                  text={result.row.title}
                  spans={result.spans}
                  wholeValueStyle={WHOLE_VALUE_STYLE}
                />
              </td>
              <td className="mono small">{result.raw}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        Both rows matched. Only one says where. The first title opens with{' '}
        <code>U+0130</code>, and case-insensitive matching folds the value first —
      </p>

      <pre>
        {`'İ'.toLowerCase() === ${JSON.stringify(folded)}   // length ${folded.length}, from 1`}
      </pre>

      <p>
        so every offset after it is shifted in the folded string relative to the original. siftql could
        report those offsets anyway and be wrong by one character for the rest of the value. Instead it
        reports the match and omits <code>ranges</code>, and the component renders the whole value as the
        answer. Note that <em>office</em> is nowhere near the İ: one character at the front is enough to
        make every later offset untrustworthy.
      </p>
    </Panel>
  );
};
