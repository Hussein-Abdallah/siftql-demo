// `/react`, not `/next`. The export map offers an entry point per framework
// and this is a Vite SPA; `@vercel/analytics/next` pulls Next-specific
// runtime that does not exist here.
import { Analytics } from '@vercel/analytics/react';

import corePkg from '@siftql/core/package.json';
import highlighterPkg from '@siftql/react-highlighter/package.json';

import { LiveQuery } from './panels/LiveQuery';
import { CaseFolding } from './panels/CaseFolding';
import { ThreeStates } from './panels/ThreeStates';
import { Astral } from './panels/Astral';
import { HostileSpans } from './panels/HostileSpans';
import { Touching } from './panels/Touching';

export const App = () => (
  <main>
    <header>
      <h1>siftql — highlighting</h1>
      <p className="lede">
        <code>@siftql/core</code> decides which rows match a query and which substrings did it.{' '}
        <code>@siftql/react-highlighter</code> paints the second answer. Both are installed from the
        registry here, at the versions below, so this page exercises the published packages rather than a
        build of anyone&rsquo;s working tree.
      </p>
      <p className="versions mono small">
        @siftql/core {corePkg.version} · @siftql/react-highlighter {highlighterPkg.version}
      </p>
    </header>

    <LiveQuery />
    <CaseFolding />
    <ThreeStates />
    <Astral />
    <Touching />
    <HostileSpans />

    <footer>
      <a href="https://github.com/Hussein-Abdallah/siftql">@siftql/core</a>
      <a href="https://github.com/Hussein-Abdallah/siftql-react-highlighter">@siftql/react-highlighter</a>
      <a href="https://hussein-abdallah.github.io/siftql/">query playground</a>
    </footer>

    {/*
      Renders nothing. It injects the beacon script and reports a pageview,
      and it is a no-op outside a Vercel deployment, so `npm run dev` stays
      quiet rather than logging failed requests.
    */}
    <Analytics />
  </main>
);
