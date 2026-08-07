# siftql-demo

A demo of [`@siftql/core`](https://github.com/Hussein-Abdallah/siftql) deciding which rows match a query and which substrings did it, and [`@siftql/react-highlighter`](https://github.com/Hussein-Abdallah/siftql-react-highlighter) painting the second answer.

The [query playground](https://hussein-abdallah.github.io/siftql/) is the place to learn the language. This is the place to see what highlighting looks like, because that part is pixels and no README can show it.

## Running it

```
npm install
npm run dev
```

`npm test` runs the expectations, `npm run build` produces `dist/`.

## Two rules this repo keeps

**The siftql packages are installed from the registry, at exact versions, and never linked.** No `file:../siftql-core`, no `npm link`, no workspace. The moment the demo builds against local source it stops being evidence about the published package and quietly becomes a build of someone's working tree. The versions in `package.json` are what the page reports in its header, read from the installed `package.json` rather than written down a second time.

**Every claim a panel makes is asserted in `test/expectations.test.ts`.** The panels state results — "both rows matched, only one says where", "the engine reports the surrogate pair as one span". A caption is prose until something runs it, and prose drifts. A wrong caption should fail a build, not sit on a public page.

## The dataset

Six rows, in `src/data.ts`, each chosen for a specific edge rather than to look like real data, with the reason written next to it. The pair the demo turns on is rows 2 and 3: the same sentence, differing only in whether it opens with `İ` (U+0130) or an ASCII `I`.

## The panels

**Query and paint** — type a query, watch the rows repaint. One `useSiftQLHighlight` call per row, which is the shape the library documents for a list.

**Why "matched" and "where" are different answers** — the centerpiece. `title:*office*` matches both İstanbul rows. Only the ASCII one reports offsets, because `'İ'.toLowerCase()` is two code units, so every offset after it is shifted in the folded string. siftql reports the match and omits `ranges` rather than being wrong by a character for the rest of the value.

**Three states, not two** — `spans`, `null` and `undefined` side by side, since a missed lookup and a match with nothing to point at are different facts.

**Offsets are UTF-16 code units** — a span covering a surrogate pair, and one splitting it. The split leaves a lone surrogate in each segment and the browser draws replacement characters. Shown rather than hidden: the concatenation invariant still holds, but what you see is not what the string says. The engine never produces such a span; only offsets computed elsewhere can.

**Touching spans merge** — `[0, 2)` and `[2, 4)` as one `<mark>` rather than two. Rendered with a bordered, translucent mark, because under a flat opaque background the two are pixel-identical and there would be nothing to look at.

**Spans that do not describe the string** — unsorted, overlapping, reversed, empty, negative, past the end. Each clamped or dropped, never thrown on, with the concatenation invariant checked on screen for every row.

## Deployment

Vite, deployed on Vercel. No configuration beyond the defaults — build `npm run build`, output `dist`.
