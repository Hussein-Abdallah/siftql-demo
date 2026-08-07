import { describe, expect, it } from 'vitest';
import { highlight } from '@siftql/core';
import { toSegments, type HighlightSpan } from '@siftql/react-highlighter';

import { ROWS } from '../src/data';

/**
 * Every claim a panel makes, asserted here.
 *
 * The page states results — "both rows matched, only one says where", "the
 * engine reports the pair as one span". A caption is prose until something runs
 * it, and prose drifts. This file is what turns a wrong caption into a failed
 * build rather than a public page that lies.
 */

const dotted = ROWS[1]!;
const ascii = ROWS[2]!;
const rocket = ROWS[3]!;
const long = ROWS[5]!;

describe('CaseFolding panel', () => {
  it('folds U+0130 into two code units, which is the whole mechanism', () => {
    expect('İ'.toLowerCase()).toHaveLength(2);
    expect(dotted.title.startsWith('İ')).toBe(true);
    // The control row must differ ONLY by that character.
    expect(dotted.title.slice(1)).toBe(ascii.title.slice(1));
  });

  it('matches both rows but reports ranges for only the ASCII one', () => {
    const onDotted = highlight('title:*office*', dotted);
    const onAscii = highlight('title:*office*', ascii);

    expect(onDotted).toHaveLength(1);
    expect(onAscii).toHaveLength(1);

    expect(onDotted[0]!.ranges).toBeUndefined();
    expect(onAscii[0]!.ranges).toEqual([{ start: 9, end: 15 }]);
  });

  it('marks exactly the word "office" on the row that reports offsets', () => {
    const ranges = highlight('title:*office*', ascii)[0]!.ranges!;
    const marked = toSegments(ascii.title, ranges)
      .filter((segment) => segment.marked)
      .map((segment) => segment.text);

    expect(marked).toEqual(['office']);
  });
});

describe('Astral panel', () => {
  it('reports the surrogate pair as one span, never a split one', () => {
    const ranges = highlight('title:*🚀*', rocket)[0]!.ranges!;

    expect(ranges).toEqual([{ start: 5, end: 7 }]);
    expect(rocket.title.slice(5, 7)).toBe('🚀');
  });

  it('keeps the concatenation invariant even when a span splits the pair', () => {
    const segments = toSegments(rocket.title, [{ start: 5, end: 6 }]);

    expect(segments.map((segment) => segment.text).join('')).toBe(rocket.title);
    // And the damage is real, which is the point the panel makes honestly:
    // the marked run is half a character.
    expect(segments.find((segment) => segment.marked)!.text).toHaveLength(1);
  });
});

describe('Touching panel', () => {
  it('merges [0, 2) and [2, 4) into a single four-character run', () => {
    const marked = toSegments('Ada Lovelace', [
      { start: 0, end: 2 },
      { start: 2, end: 4 },
    ]).filter((segment) => segment.marked);

    expect(marked).toHaveLength(1);
    expect(marked[0]!.text).toBe('Ada ');
  });
});

describe('HostileSpans panel', () => {
  const TEXT = 'Ada Lovelace';
  const CASES: readonly HighlightSpan[][] = [
    [{ start: 4, end: 8 }, { start: 0, end: 3 }],
    [{ start: 0, end: 5 }, { start: 3, end: 8 }],
    [{ start: 0, end: 2 }, { start: 2, end: 4 }],
    [{ start: 8, end: 4 }],
    [{ start: 4, end: 4 }],
    [{ start: -5, end: 3 }],
    [{ start: 8, end: 9999 }],
    [{ start: 500, end: 900 }],
  ];

  it('never drops or duplicates a character, for any of them', () => {
    let checked = 0;

    for (const spans of CASES) {
      const segments = toSegments(TEXT, spans);
      expect(segments.map((segment) => segment.text).join('')).toBe(TEXT);
      checked += 1;
    }

    // Guard against the loop silently doing nothing — a green test that
    // asserted zero times is the failure mode this project keeps hitting.
    expect(checked).toBe(CASES.length);
    expect(checked).toBeGreaterThan(0);
  });

  it('clamps a span reaching past the end rather than throwing', () => {
    const segments = toSegments(long.title, [{ start: long.title.length - 4, end: 10_000 }]);

    expect(segments.map((segment) => segment.text).join('')).toBe(long.title);
    expect(segments.find((segment) => segment.marked)!.text).toBe(long.title.slice(-4));
  });
});
