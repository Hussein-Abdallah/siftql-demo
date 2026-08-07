import type { CSSProperties } from 'react';

/**
 * The whole-value state has to look DELIBERATE.
 *
 * The component's default is a plain underline, which is right for a library —
 * it is the least opinionated thing that is still visible. On this page it was
 * the wrong choice: in a table of results, a thin underline reads as "no
 * highlight" rather than as a third state, and the first person to look at the
 * demo asked why that row had no mark. Being unmissable is the demo's job, not
 * the library's.
 */
export const WHOLE_VALUE_STYLE: CSSProperties = {
  textDecoration: 'underline dotted',
  textDecorationThickness: '2px',
  textUnderlineOffset: '3px',
  background: 'var(--whole)',
  borderRadius: '3px',
  padding: '0 3px',
};
