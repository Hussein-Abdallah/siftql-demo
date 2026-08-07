/**
 * Six rows, each chosen for a specific edge rather than to look like real data.
 *
 * A demo dataset that only holds ordinary strings can only demonstrate the case
 * that never fails. Every row here exists because something about it changes
 * what the engine or the highlighter does, and the reason is written down next
 * to it.
 */
export interface Row {
  readonly id: number;
  readonly title: string;
  readonly owner: string;
  readonly tag: string;
}

export const ROWS: readonly Row[] = [
  // The control. Ordinary ASCII, so offsets mean exactly what you expect.
  { id: 1, title: 'Ship the search box', owner: 'Ada Lovelace', tag: 'frontend' },

  // The pair this whole demo turns on. Row 2 opens with U+0130 LATIN CAPITAL
  // LETTER I WITH DOT ABOVE; row 3 is the same sentence with an ASCII I.
  // 'İ'.toLowerCase() is TWO code units, so case-insensitive matching happens in
  // a string longer than the original and offsets no longer map back. siftql
  // reports the match and omits `ranges`. Row 3 is the control that proves the
  // difference is the character and not the query.
  { id: 2, title: 'İstanbul office rollout', owner: 'Hedy Lamarr', tag: 'ops' },
  { id: 3, title: 'Istanbul office rollout', owner: 'Hedy Lamarr', tag: 'ops' },

  // An astral character: the rocket is a surrogate PAIR, two UTF-16 code units.
  // Offsets are code units, so a span can land in the middle of it.
  { id: 4, title: 'Ship 🚀 the search box', owner: 'Grace Hopper', tag: 'frontend' },

  // A literal asterisk in the value, which has to survive being queried for in a
  // language where `*` is the wildcard.
  { id: 5, title: 'Escape a* in wildcards', owner: 'Alan Turing', tag: 'parser' },

  // Long enough that a span computed against a truncated copy of the string
  // would point past the end of what is rendered.
  {
    id: 6,
    title:
      'Rewrite the tokenizer so that quoted phrases, escaped wildcards and regular expressions all share one scanner',
    owner: 'Katherine Johnson',
    tag: 'parser',
  },
];

/** Queries worth arriving on, each with the reason it is interesting. */
export const PRESETS: readonly { readonly q: string; readonly why: string }[] = [
  { q: 'title:*office*', why: 'Same query, two rows. One paints, one underlines.' },
  { q: 'search', why: 'A bare word browses every field.' },
  { q: 'title:*🚀*', why: 'The engine reports the surrogate pair as one span.' },
  { q: 'title:*a\\**', why: 'An escaped asterisk is a literal, not a wildcard.' },
  { q: 'owner:"Ada Lovelace"', why: 'A quoted phrase matches the whole value.' },
  { q: 'tag:ops', why: 'Naming a field asserts against the whole value.' },
];
