export default function StrideScorePage() {
  return (
    <div className="ss-shell">
      <header className="ss-nav">
        <a className="ss-brand" href="/" aria-label="StrideScore home">
          <span className="ss-icon" aria-hidden="true">↗</span>
          <span>StrideScore</span>
        </a>
        <nav>
          <a href="#features">Features</a>
          <a href="/support">Support</a>
        </nav>
      </header>

      <main>
        <section className="ss-hero">
          <p className="ss-kicker">Walking, scored.</p>
          <h1>Make every walk count.</h1>
          <p className="ss-lead">
            Track focused walking sessions with steps, time, distance, and routes.
            See your progress without turning movement into another complicated dashboard.
          </p>
          <div className="ss-actions">
            <span className="ss-badge">StrideScore for iPhone</span>
            <a className="ss-link" href="mailto:StrideScore@ndsoft.dev">Contact support</a>
          </div>
        </section>

        <section className="ss-grid" id="features" aria-label="StrideScore features">
          <article>
            <span>01</span>
            <h2>Session tracking</h2>
            <p>Start a walk and keep steps, elapsed time, distance, and activity together in one session.</p>
          </article>
          <article>
            <span>02</span>
            <h2>Route view</h2>
            <p>Use location when you want a visual route of where your session took you.</p>
          </article>
          <article>
            <span>03</span>
            <h2>Progress</h2>
            <p>Keep a history of your walks so you can see how your activity builds over time.</p>
          </article>
        </section>

        <section className="ss-note">
          <p>Built by ND SOFT</p>
          <h2>Movement should feel rewarding, not complicated.</h2>
          <a href="https://ndsoft.dev">Visit ND SOFT</a>
        </section>
      </main>

      <footer className="ss-footer">
        <span>© 2026 ND SOFT LLC</span>
        <div>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/support">Support</a>
        </div>
      </footer>
    </div>
  );
}
