import Link from 'next/link';

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="pt-24 pb-16">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight max-w-3xl">
          Powerful apps,{' '}
          <span className="text-[var(--color-brand)]">refreshingly simple</span>.
        </h1>
        <p className="mt-8 text-lg text-[var(--color-text-dim)] max-w-2xl leading-relaxed">
          ND Software designs focused apps for iPhone and iPad, starting with
          Uncrop It, which extends any photo beyond its edges with AI and
          reframes it to fit anywhere.
        </p>
      </section>

      <section className="pb-16">
        <h2 className="text-sm uppercase tracking-widest text-[var(--color-text-dim)] mb-6">
          Apps
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Link
            href="/apps/uncrop-it"
            className="group block p-7 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-brand)] transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-medium text-[var(--color-brand)] uppercase tracking-wider">
                  iOS · iPhone & iPad
                </div>
                <h3 className="mt-2 text-2xl font-bold">Uncrop It</h3>
                <p className="mt-3 text-sm text-[var(--color-text-dim)] leading-relaxed">
                  Extend any photo beyond its borders with AI outpainting, then
                  resize it to fit any social platform, with no manual cropping.
                </p>
              </div>
            </div>
            <div className="mt-6 text-sm font-medium text-[var(--color-brand)] group-hover:underline">
              Learn more →
            </div>
          </Link>

          <div className="p-7 rounded-2xl bg-[var(--color-card)] border border-dashed border-[var(--color-border)] flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-[var(--color-text-dim)]">
                More apps coming soon
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <h2 className="text-sm uppercase tracking-widest text-[var(--color-text-dim)] mb-6">
          About
        </h2>
        <p className="text-[var(--color-text-dim)] max-w-2xl leading-relaxed">
          ND Software LLC is an independent app studio based in Arizona.
          Questions, feedback, or bug reports?{' '}
          <a
            href="mailto:support@ndsoft.dev"
            className="text-[var(--color-brand)] hover:underline"
          >
            support@ndsoft.dev
          </a>
          .
        </p>
      </section>
    </div>
  );
}
