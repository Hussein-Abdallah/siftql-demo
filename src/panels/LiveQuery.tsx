import { useMemo, useState } from 'react';
import { createEngine } from '@siftql/core';
import { SiftQLHighlight } from '@siftql/react-highlighter';
import { useSiftQLHighlight } from '@siftql/react-highlighter/siftql';

import { ROWS, PRESETS, type Row } from '../data';
import { Panel } from '../Panel';
import { WHOLE_VALUE_STYLE } from '../marks';

const engine = createEngine();

/**
 * A key, because the interesting state is the one that looks like nothing.
 *
 * Without it a reader meets `İstanbul office rollout` with no mark on it and
 * concludes the highlighter missed, which is the opposite of what happened.
 */
const Legend = () => (
  <div className="legend small">
    <span>
      <SiftQLHighlight text="marked" spans={[{ start: 0, end: 6 }]} /> these offsets matched
    </span>
    <span>
      <SiftQLHighlight text="whole value" spans={null} wholeValueStyle={WHOLE_VALUE_STYLE} /> matched,
      but siftql cannot say where
    </span>
    <span>
      <SiftQLHighlight text="plain" spans={undefined} /> not why the row matched
    </span>
  </div>
);

/**
 * One row, one hook call.
 *
 * The hook belongs HERE rather than in the parent, because a hook cannot be
 * called in a loop. That is not a limitation to work around — it is the shape
 * the library documents for a list: one component per item, spans computed once
 * for the item, then read per field.
 */
const RowView = ({ row, query, matched }: { row: Row; query: string; matched: boolean }) => {
  const spansFor = useSiftQLHighlight(query, row);

  return (
    <tr className={matched ? undefined : 'dim'}>
      <td className="num">{row.id}</td>
      {(['title', 'owner', 'tag'] as const).map((field) => (
        <td key={field}>
          <SiftQLHighlight
            text={row[field]}
            spans={spansFor(field)}
            wholeValueStyle={WHOLE_VALUE_STYLE}
          />
        </td>
      ))}
    </tr>
  );
};

export const LiveQuery = () => {
  const [query, setQuery] = useState('title:*office*');

  // `filter` throws on a query that does not parse; the HOOK does not, by
  // design. So the table keeps painting while the box is mid-keystroke and only
  // the match set goes stale — which is the split the library argues for.
  const { matched, error } = useMemo(() => {
    try {
      const ids = new Set(engine.filter(query, ROWS).map((row) => row.id));
      return { matched: ids, error: undefined };
    } catch (err) {
      return { matched: undefined, error: err instanceof Error ? err.message : String(err) };
    }
  }, [query]);

  return (
    <Panel
      title="Query and paint"
      lede="The engine decides which rows match and which substrings did it; the component paints the second answer. Each field lands in one of three states, and on the query below, row 2 is in the middle one — matched, with nothing to mark. The panel after this explains why that row and row 3 differ."
    >
      <input
        className="query"
        value={query}
        spellCheck={false}
        aria-label="siftql query"
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="presets">
        {PRESETS.map((preset) => (
          <button key={preset.q} type="button" title={preset.why} onClick={() => setQuery(preset.q)}>
            {preset.q}
          </button>
        ))}
      </div>

      <p className="status" role="status">
        {error ? (
          <span className="error">does not parse — {error}</span>
        ) : (
          `${matched?.size ?? 0} of ${ROWS.length} rows match`
        )}
      </p>

      <Legend />

      <table>
        <thead>
          <tr>
            <th className="num">id</th>
            <th>title</th>
            <th>owner</th>
            <th>tag</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <RowView key={row.id} row={row} query={query} matched={matched?.has(row.id) ?? false} />
          ))}
        </tbody>
      </table>
    </Panel>
  );
};
