import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uncrop It Privacy Policy',
  description: 'Privacy policy for the Uncrop It app by ND Software LLC.',
};

const EFFECTIVE_DATE = 'June 18, 2026';

export default function UncropItPrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 prose-legal">
      <header className="mb-10">
        <div className="text-xs font-medium text-[var(--color-brand)] uppercase tracking-wider">
          Uncrop It
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[var(--color-text)]">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-[var(--color-text-dim)]">
          Effective {EFFECTIVE_DATE}
        </p>
      </header>

      <p>
        This Privacy Policy applies to the Uncrop It app published by ND Software
        LLC (&ldquo;ND Software,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;), which also operates the website at{' '}
        <a href="https://ndsoftware.dev">ndsoftware.dev</a>. It explains what
        information Uncrop It collects, how we use it, and the choices you have.
      </p>

      <p>
        <strong>The short version:</strong> Uncrop It edits photos using AI that
        runs on our servers, so a photo you choose to edit is uploaded to us,
        processed, and returned to you. We use that data only to provide the
        feature you asked for. We don&rsquo;t sell your data, we don&rsquo;t use
        your photos to train AI models, and we don&rsquo;t serve advertising.
        Details below.
      </p>

      <h2>1. Information We Collect</h2>

      <h3>1.1 Account information</h3>
      <p>
        Uncrop It uses Firebase Authentication to sign you in. You can continue
        anonymously, or sign in with Apple or Google. When you sign in, we
        receive a unique account identifier and, depending on the method you
        choose and your settings, an email address. Sign in with Apple lets you
        hide your real email behind a private relay address. We use this
        information to maintain your account and associate your edits with you.
      </p>

      <h3>1.2 Photos and edits you create</h3>
      <p>
        When you ask Uncrop It to uncrop, resize, or animate a photo, the image
        you select is uploaded to our cloud storage so the AI can process it. We
        store the source image, the resulting output, and a record of the job
        (such as the operation type, parameters, status, and timestamp) so the
        feature works and so we can troubleshoot failures. Photos you do not
        choose to process are not uploaded.
      </p>

      <h3>1.3 Support requests</h3>
      <p>
        If you submit a support ticket from within the App or email us, we
        receive the message you send, the email address associated with your
        account or sender, and basic context such as the app version. We use
        this to respond to you and improve the App.
      </p>

      <h3>1.4 Technical information</h3>
      <p>
        Our backend and hosting providers automatically log standard technical
        information (such as IP addresses, timestamps, device and
        operating-system details, and request metadata) to operate, secure, and
        debug the service.
      </p>

      <h2>2. How We Use Information</h2>
      <ul>
        <li>To provide the editing features you request and return results to you.</li>
        <li>To maintain your account and sync your work across your devices.</li>
        <li>To process and manage in-app purchases and entitlements.</li>
        <li>To respond to support requests and fix problems.</li>
        <li>To protect the service against abuse, fraud, and security threats.</li>
      </ul>
      <p>We do not:</p>
      <ul>
        <li>Sell or rent your personal information to third parties.</li>
        <li>Use your photos or edits to train AI or machine-learning models.</li>
        <li>Serve advertising or use advertising identifiers.</li>
      </ul>

      <h2>3. Service Providers and Third Parties</h2>

      <h3>3.1 Google / Firebase</h3>
      <p>
        We use Google&rsquo;s Firebase platform for authentication, cloud
        storage, database, and backend functions. Your account data, uploaded
        images, outputs, and job records are stored using Firebase services on
        Google Cloud infrastructure. Google processes this data on our behalf
        under{' '}
        <a
          href="https://firebase.google.com/support/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Firebase&rsquo;s privacy and security terms
        </a>
        .
      </p>

      <h3>3.2 AI inference providers</h3>
      <p>
        The actual AI processing (outpainting, resizing, and animation) is
        carried out through third-party model-hosting providers. To run an edit,
        we send the image and parameters you provided to the provider, which
        returns the processed result. We select providers that process this
        content to perform the requested task and do not use it to train their
        own models. We do not send your account email or other identifying
        profile information to these providers along with the image.
      </p>

      <h3>3.3 Apple</h3>
      <p>
        Uncrop It runs on Apple platforms. When you download the app or make a
        purchase through the App Store, Apple collects and processes information
        in accordance with{' '}
        <a
          href="https://www.apple.com/legal/privacy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Apple&rsquo;s Privacy Policy
        </a>
        . We do not control this processing.
      </p>

      <h3>3.4 RevenueCat</h3>
      <p>
        We use RevenueCat, Inc. (&ldquo;RevenueCat&rdquo;) to process in-app
        purchases and manage entitlements. When you make or restore a purchase,
        RevenueCat receives information necessary to verify and manage that
        transaction, which may include a pseudonymous application user ID, the
        product identifier, the purchase receipt, your device&rsquo;s country
        and timezone, and general device and operating-system information. For
        details, see{' '}
        <a
          href="https://www.revenuecat.com/privacy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          RevenueCat&rsquo;s Privacy Policy
        </a>
        .
      </p>

      <h3>3.5 Website hosting</h3>
      <p>
        Our website is hosted by Vercel Inc. Vercel&rsquo;s servers
        automatically log standard request information (such as IP addresses,
        timestamps, and requested URLs) for the purpose of operating and
        securing the service. We do not place tracking or advertising cookies on
        this site.
      </p>

      <h2>4. Data Retention</h2>
      <p>
        We retain account data for as long as your account exists. Uploaded
        images, outputs, and job records are retained to provide the service and
        your edit history; you can request deletion of this content as described
        below. Support messages are kept for as long as reasonably necessary to
        provide support or comply with legal obligations.
      </p>

      <h2>5. Children</h2>
      <p>
        Uncrop It is not directed to children under 13, and we do not knowingly
        collect personal information from children. If you believe a child has
        provided us with personal information, please contact us and we will take
        appropriate steps to delete it.
      </p>

      <h2>6. Your Rights and Choices</h2>
      <p>
        You can request access to, correction of, or deletion of your account
        and the content associated with it by emailing us at{' '}
        <a href="mailto:support@ndsoft.dev">support@ndsoft.dev</a>. Depending on
        where you live, you may have additional rights under laws such as the
        California Consumer Privacy Act (CCPA) or the EU General Data Protection
        Regulation (GDPR); we honor those rights where they apply. To manage or
        delete data held by Apple or RevenueCat, please consult their respective
        privacy policies linked above.
      </p>

      <h2>7. Security</h2>
      <p>
        We use standard industry practices to protect the information we handle,
        including encrypted transport (HTTPS) for all network requests and
        access controls on our backend. No system is perfectly secure; we cannot
        guarantee absolute security but we take reasonable steps to protect your
        data.
      </p>

      <h2>8. International Users</h2>
      <p>
        ND Software is based in Arizona, United States. The third parties we rely
        on (including Google, our AI providers, Apple, RevenueCat, and Vercel)
        may process data in the United States or other countries. If you access
        Uncrop It from outside the United States, you understand that your
        information may be processed in jurisdictions with different
        data-protection rules.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will
        update the &ldquo;Effective&rdquo; date at the top of this page. Material
        changes will be reflected prominently on this page. Continued use of
        Uncrop It after the updated policy takes effect means you accept the
        updated policy.
      </p>

      <h2>10. Contact</h2>
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

      <p className="mt-10 text-sm">
        See also the{' '}
        <a href="/apps/uncrop-it/terms">Uncrop It Terms of Service</a>.
      </p>
    </article>
  );
}
