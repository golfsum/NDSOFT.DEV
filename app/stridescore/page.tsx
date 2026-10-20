const testFlightUrl = "https://testflight.apple.com/join/kpGhqe6Z";

const features = [
  ["01", "Timed challenges", "Pick 5, 10, 15, 20, 30, or 60 minutes and see how many steps you can get before the clock runs out."],
  ["02", "Open walks", "Prefer no time limit? Start Stopwatch mode and walk as long as you like."],
  ["03", "Personal bests", "Turn every session into something measurable and give yourself a score to beat next time."],
  ["04", "Routes + Explore", "Optionally track your route, reveal new ground, and build a private map of where you have walked."],
  ["05", "Apple Watch + Live Activity", "Keep your timer and session progress close on Apple Watch and your iPhone Lock Screen."],
  ["06", "Achievements + friends", "Collect achievements, build streaks, challenge friends, and compare walking scores."]
];

export default function StrideScorePage() {
  return (
    <div className="ss-shell ss-app-site">
      <a className="ss-skip" href="#main">Skip to content</a>

      <header className="ss-nav">
        <a className="ss-brand" href="/" aria-label="StrideScore home">
          <img className="ss-app-icon" src="/stridescore/images/app-icon.png" width="44" height="44" alt="" />
          <span>StrideScore</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#screens">App</a>
          <a href={testFlightUrl} className="ss-nav-beta">Join beta</a>
        </nav>
      </header>

      <main id="main">
        <section className="ss-hero ss-hero-app">
          <div className="ss-hero-copy">
            <p className="ss-kicker">Walking, scored.</p>
            <h1>How many steps<br />can you do?</h1>
            <p className="ss-lead">
              Pick a time. Start walking. Beat your best. StrideScore turns everyday walks into simple challenges
              with personal bests, achievements, routes, Apple Watch support, and more.
            </p>
            <div className="ss-actions">
              <a className="ss-badge" href={testFlightUrl}>Join on TestFlight ↗</a>
              <a className="ss-link" href="#screens">See the app ↓</a>
            </div>
            <div className="ss-hero-pills" aria-label="StrideScore highlights">
              <span>iPhone</span><span>Apple Watch</span><span>Live Activities</span>
            </div>
          </div>

          <div className="ss-phone-stage" aria-label="StrideScore app preview">
            <div className="ss-phone-glow" />
            <img
              className="ss-phone ss-phone-main"
              src="/stridescore/images/home-challenge.webp"
              alt="StrideScore challenge screen showing timed walking challenges"
              width="280"
              height="609"
              fetchPriority="high"
            />
          </div>
        </section>

        <section className="ss-proof-strip" aria-label="StrideScore summary">
          <div><strong>Pick a time</strong><span>5 to 60 minute challenges</span></div>
          <div><strong>Walk your way</strong><span>Timed or open-ended</span></div>
          <div><strong>Come back stronger</strong><span>PBs, history, achievements</span></div>
        </section>

        <section className="ss-intro" id="features">
          <p className="ss-kicker">Small challenges. Big progress.</p>
          <h2>A walking app built around the walk you are taking right now.</h2>
          <p>
            No giant fitness dashboard to decipher. Start a session, watch your steps climb, finish with a score,
            and see how today compares with the walks that came before it.
          </p>
        </section>

        <section className="ss-grid ss-feature-grid" aria-label="StrideScore features">
          {features.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </section>

        <section className="ss-screens" id="screens" aria-labelledby="screens-title">
          <div className="ss-screens-copy">
            <p className="ss-kicker">Designed to feel like the app</p>
            <h2 id="screens-title">Everything important stays close.</h2>
            <p>
              Start from the Home screen, then revisit completed sessions with pace, distance, Explore XP,
              and a map of the ground you covered.
            </p>
            <ul>
              <li>Fast challenge setup</li>
              <li>Recent activity and weekly progress</li>
              <li>Route tracking stays optional</li>
              <li>Your route remains private</li>
            </ul>
          </div>

          <div className="ss-screen-pair" aria-label="StrideScore screenshots">
            <figure className="ss-screen-card ss-screen-front">
              <img
                src="/stridescore/images/home-challenge.webp"
                alt="StrideScore Home screen with challenge durations and Start Challenge button"
                width="280"
                height="609"
                loading="lazy"
              />
              <figcaption>Choose a challenge and go.</figcaption>
            </figure>
            <figure className="ss-screen-card ss-screen-back">
              <img
                src="/stridescore/images/route-detail.webp"
                alt="StrideScore completed session showing pace, Explore XP, and route details"
                width="240"
                height="522"
                loading="lazy"
              />
              <figcaption>See the walk you just completed.</figcaption>
            </figure>
          </div>
        </section>

        <section className="ss-art-section">
          <figure className="ss-art">
            <img
              src="/stridescore/images/walking-landscape.png"
              alt="StrideScore desert artwork with mountains, city skyline, and saguaro cacti"
              width="1026"
              height="488"
              loading="lazy"
            />
            <figcaption>
              <span>STRIDESCORE</span>
              <strong>Small challenges.<br />Big progress.</strong>
              <span>Your next best starts with one step.</span>
            </figcaption>
          </figure>
        </section>

        <section className="ss-how" aria-labelledby="how-title">
          <div>
            <p className="ss-kicker">Your first walk</p>
            <h2 id="how-title">Three taps from sitting to moving.</h2>
            <p>Pick a mode, choose your challenge, and start walking.</p>
          </div>
          <ol>
            <li><strong>Choose Challenge or Stopwatch</strong><p>Set a target time or keep the walk open-ended.</p></li>
            <li><strong>Start moving</strong><p>StrideScore follows your steps, pace, and distance while you walk.</p></li>
            <li><strong>Finish with something to beat</strong><p>Review your result, route, achievements, and progress.</p></li>
          </ol>
        </section>

        <section className="ss-note ss-beta" id="beta" aria-labelledby="beta-title">
          <img className="ss-beta-icon" src="/stridescore/images/app-icon.png" alt="StrideScore app icon" width="100" height="100" loading="lazy" />
          <div>
            <p className="ss-kicker">TestFlight beta</p>
            <h2 id="beta-title">Take it for a walk.</h2>
            <p>
              StrideScore is currently in beta. Try it on a real walk and help us improve step syncing,
              Apple Watch behavior, Live Activities, routes, and the overall experience.
            </p>
            <a className="ss-badge" href={testFlightUrl}>Join the TestFlight beta ↗</a>
            <p className="ss-small">Open the link on your iPhone and follow Apple’s TestFlight prompts.</p>
          </div>
        </section>

        <section className="ss-faq" aria-labelledby="faq-title">
          <div><p className="ss-kicker">Good to know</p><h2 id="faq-title">Before your first step.</h2></div>
          <div>
            <details><summary>Do I need an Apple Watch?</summary><p>No. StrideScore works on iPhone. Apple Watch support adds another way to follow and record your session.</p></details>
            <details><summary>Do I have to track my route?</summary><p>No. Route tracking is optional and can be turned off for indoor or treadmill walks.</p></details>
            <details><summary>Are my routes shared with friends?</summary><p>No. Route geometry is private. Friend features use safe activity totals rather than sharing where you walked.</p></details>
            <details><summary>What is StrideScore Pro?</summary><p>Pro adds features such as unlimited history, the exploration map, advanced stats, custom challenge lengths, and the full achievement collection.</p></details>
            <details><summary>How do I send beta feedback?</summary><p>Send feedback through TestFlight or email <a href="mailto:StrideScore@ndsoft.dev">StrideScore@ndsoft.dev</a>.</p></details>
          </div>
        </section>
      </main>

      <footer className="ss-footer">
        <span>© 2026 ND SOFT LLC</span>
        <div><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/support">Support</a></div>
      </footer>
    </div>
  );
}
