import type { ReactNode } from 'react';

export const Panel = ({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children: ReactNode;
}) => (
  <section className="panel">
    <h2>{title}</h2>
    {lede === undefined ? null : <p className="lede">{lede}</p>}
    {children}
  </section>
);
