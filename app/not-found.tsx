import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found container">
      <Link className="brand" href="/" aria-label="ND SOFT home">
        <span className="brand-mark" aria-hidden="true" />
        <span>ND SOFT</span>
      </Link>
      <p className="eyebrow">404 / Page not found</p>
      <h1>
        Nothing here.
        <span>The products are one page back.</span>
      </h1>
      <Link className="not-found-link" href="/">
        Return home <span className="arrow" aria-hidden="true" />
      </Link>
    </main>
  );
}
