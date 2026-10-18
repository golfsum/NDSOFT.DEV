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
            StrideScore turns walking into timed challenges, personal bests, achievements,
            Apple Watch sessions, and exploration. Pick a time, start walking, and see what you can beat.
          </p>
          <div className="ss-actions">
            <a
              className="ss-badge"
              href="mailto:StrideScore@ndsoft.dev?subject=StrideScore%20TestFlight%20Beta"
            >
              Join the TestFlight beta
            </a>
            <a className="ss-link" href="mailto:StrideScore@ndsoft.dev">Contact support</a>
          </div>
        </section>

        <section className="ss-grid" id="features" aria-label="StrideScore features">
          <article>
            <span>01</span>
            <h2>Timed challenges</h2>
            <p>Choose a challenge length, track your steps, and try to beat your previous score.</p>
          </article>
          <article>
            <span>02</span>
            <h2>Apple Watch + Live Activity</h2>
            <p>Keep your timer and steps close by on Apple Watch and the iPhone Lock Screen.</p>
          </article>
          <article>
            <span>03</span>
            <h2>Explore and improve</h2>
            <p>Track routes, earn achievements, build streaks, and watch your walking history grow.</p>
          </article>
        </section>

        <section className="ss-note">
          <p>StrideScore beta</p>
          <h2>Help test the next version of walking challenges.</h2>
          <a href="mailto:StrideScore@ndsoft.dev?subject=StrideScore%20TestFlight%20Beta">
            Request TestFlight access
          </a>
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
