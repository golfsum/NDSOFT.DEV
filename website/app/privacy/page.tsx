import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy policy for ND Software LLC and its apps, including BuildPad.',
};

const EFFECTIVE_DATE = 'April 22, 2026';

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 prose-legal">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text)]">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-[var(--color-text-dim)]">
          Effective {EFFECTIVE_DATE}
        </p>
      </header>

      <p>
        ND Software LLC (&ldquo;ND Software,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
        operates the website at{' '}
        <a href="https://ndsoftware.dev">ndsoftware.dev</a> and publishes
        BuildPad and other applications for Apple platforms (each, an
        &ldquo;App&rdquo;). This Privacy Policy explains what information we
        collect, how we use it, and the choices you have.
      </p>

      <p>
        <strong>The short version:</strong> our apps are designed to work
        without accounts and without us collecting your data. We don&rsquo;t
        run servers that process your content. Purchases are handled by Apple
        and RevenueCat, which receive a limited, pseudonymous set of data to
        process the transaction. Details below.
      </p>

      <h2>1. Information We Do Not Collect</h2>
      <p>
        We do not run servers that receive, process, or store the content you
        create or view in our apps. BuildPad, for example, talks directly from
        your device to Apple&rsquo;s App Store Connect API using your own API
        key. Your API key, the build data it returns, and any other content
        are stored locally on your device (for BuildPad, in the iOS Keychain)
        and are never transmitted to ND Software.
      </p>
      <p>We do not:</p>
      <ul>
        <li>Operate user accounts or identity systems for our apps.</li>
        <li>Collect analytics, usage telemetry, or behavioral data.</li>
        <li>Use crash-reporting or session-replay services.</li>
        <li>Sell or rent personal information to third parties.</li>
        <li>Serve advertising or use advertising identifiers.</li>
      </ul>

      <h2>2. Information Collected by Third Parties</h2>

      <h3>2.1 Apple</h3>
      <p>
        Our apps run on Apple platforms and interact with Apple services. When
        you download an app, make a purchase through the App Store, or use
        BuildPad to query the App Store Connect API, Apple collects and
        processes information in accordance with{' '}
        <a
          href="https://www.apple.com/legal/privacy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Apple&rsquo;s Privacy Policy
        </a>
        . We do not control this processing.
      </p>

      <h3>2.2 RevenueCat</h3>
      <p>
        We use RevenueCat, Inc. (&ldquo;RevenueCat&rdquo;) to process in-app
        purchases and manage entitlements. When you make or restore a purchase
        in one of our apps, RevenueCat receives information necessary to
        verify and manage that transaction. This may include a pseudonymous
        application user ID, the identifier of the product purchased, the
        purchase receipt, your device&rsquo;s country and timezone, and
        general device and operating-system information. RevenueCat does not
        receive your name, email address, or your App Store Connect API key.
        For details on RevenueCat&rsquo;s data practices, see{' '}
        <a
          href="https://www.revenuecat.com/privacy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          RevenueCat&rsquo;s Privacy Policy
        </a>
        .
      </p>

      <h3>2.3 Website Hosting</h3>
      <p>
        This website is hosted by Vercel Inc. Vercel&rsquo;s servers
        automatically log standard request information (such as IP addresses,
        timestamps, and requested URLs) for the purpose of operating and
        securing the service. We do not use Vercel&rsquo;s analytics features
        and we do not place any tracking or advertising cookies on this site.
      </p>

      <h2>3. Information You Send Us Directly</h2>
      <p>
        If you contact us at{' '}
        <a href="mailto:support@ndsoft.dev">support@ndsoft.dev</a>, we receive
        the email address you send from and the contents of your message. We
        use this information solely to respond to you and retain it for as
        long as reasonably necessary to provide support or comply with legal
        obligations.
      </p>

      <h2>4. Children</h2>
      <p>
        Our apps and website are not directed to children under 13, and we do
        not knowingly collect personal information from children. If you
        believe a child has provided us with personal information, please
        contact us and we will take appropriate steps to delete it.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        Because we do not maintain user accounts and do not collect personal
        information about you as part of the apps&rsquo; normal operation, we
        generally do not have data to access, correct, or delete. If you have
        interacted with us by email or have questions about your rights under
        laws such as the California Consumer Privacy Act (CCPA), the EU
        General Data Protection Regulation (GDPR), or similar regulations, you
        can contact us at{' '}
        <a href="mailto:support@ndsoft.dev">support@ndsoft.dev</a>.
      </p>
      <p>
        To manage or delete data held by Apple or RevenueCat, please consult
        their respective privacy policies linked above.
      </p>

      <h2>6. Security</h2>
      <p>
        We use standard industry practices to protect any information we
        receive, including encrypted transport (HTTPS) for all network
        requests from our apps and website. Local data stored by BuildPad on
        your device is protected using the iOS Keychain. No system is
        perfectly secure; we cannot guarantee absolute security but we take
        reasonable steps to protect the limited data we do handle.
      </p>

      <h2>7. International Users</h2>
      <p>
        ND Software is based in Arizona, United States. Third parties we rely
        on (including Apple, RevenueCat, and Vercel) may process data in the
        United States or other countries. If you access our apps or website
        from outside the United States, you understand that your information
        may be processed in jurisdictions with different data-protection
        rules.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we
        will update the &ldquo;Effective&rdquo; date at the top of this page.
        Material changes will be reflected prominently on this page. Continued
        use of our apps or website after the updated policy takes effect means
        you accept the updated policy.
      </p>

      <h2>9. Contact</h2>
      <p>
        If you have questions about this Privacy Policy, contact us at:
      </p>
      <p>
        ND Software LLC
        <br />
        Arizona, USA
        <br />
        <a href="mailto:support@ndsoft.dev">support@ndsoft.dev</a>
      </p>
    </article>
  );
}
