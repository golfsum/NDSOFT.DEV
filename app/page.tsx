type Product = {
  number: string;
  name: string;
  category: string;
  description: string;
  destination: string;
  status: string;
  href?: string;
};

const products: Product[] = [
  {
    number: "01",
    name: "AppsResolve",
    category: "Application support",
    description:
      "Human-reviewed AI application support for SaaS teams. Tickets become clear replies, grounded answers, and developer-ready bug reports.",
    href: "https://appsresolve.com",
    destination: "appsresolve.com",
    status: "Live",
  },
  {
    number: "02",
    name: "Tranqly",
    category: "Daily reflection",
    description:
      "A one-minute daily reflection companion that remembers what matters and helps you notice patterns across your days.",
    href: "https://tranqly.app",
    destination: "tranqly.app",
    status: "Current project",
  },
  {
    number: "03",
    name: "PawProof",
    category: "Pet care",
    description:
      "Scan pet records, keep care details together, and get reminders before vaccines, medication, or appointments are due.",
    href: "https://pawproof.app",
    destination: "pawproof.app",
    status: "Available now",
  },
  {
    number: "04",
    name: "TeeLesson",
    category: "Golf coaching",
    description:
      "A focused workspace for golf coaches to run students, lessons, practice, progress, and the business around every swing.",
    destination: "TeeLesson app",
    status: "In development",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ndsoft.dev/#organization",
      name: "ND SOFT LLC",
      url: "https://ndsoft.dev/",
      description:
        "Independent software studio behind AppsResolve, Tranqly, PawProof, and TeeLesson.",
    },
    {
      "@type": "ItemList",
      name: "ND SOFT products",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.name,
        ...(product.href ? { url: product.href } : {}),
      })),
    },
  ],
};

function Arrow() {
  return <span className="arrow" aria-hidden="true" />;
}

export default function Home() {
  return (
    <div className="site-shell" id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="site-header container">
        <a className="brand" href="#top" aria-label="ND SOFT home">
          <span className="brand-mark" aria-hidden="true" />
          <span>ND SOFT</span>
        </a>
        <div className="header-meta">
          <span className="studio-status">Independent studio</span>
          <a className="text-link" href="#work">
            View the work
          </a>
        </div>
      </header>

      <main>
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Products with a human point of view</p>
            <h1 id="hero-title">
              Four products.
              <span>One independent studio.</span>
            </h1>
          </div>

          <aside className="hero-note" aria-label="About ND SOFT">
            <strong>ND SOFT / 2026</strong>
            <p>
              Small, focused software built to make support, reflection, pet
              care, and coaching easier to manage.
            </p>
          </aside>

          <div className="orbit" aria-hidden="true">
            <span />
          </div>
        </section>

        <aside className="move-note" aria-label="AppsResolve transition notice">
          <div className="container move-note-inner">
            <span className="meta-label">A note on support</span>
            <p>
              Application support has a new home. <strong>AppsResolve</strong>
              now carries that work forward.
            </p>
            <a href="https://appsresolve.com">
              Visit AppsResolve <Arrow />
            </a>
          </div>
        </aside>

        <section className="portfolio container" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <div>
              <p className="meta-label">Selected products</p>
              <h2 id="work-title">The portfolio</h2>
            </div>
            <p>Four products / One maker</p>
          </div>

          <div className="project-list">
            {products.map((product) => {
              const content = (
                <>
                  <span className="project-number">{product.number}</span>
                  <div className="project-name-wrap">
                    <span className="project-category">{product.category}</span>
                    <h3 id={`product-${product.number}`}>{product.name}</h3>
                  </div>
                  <p className="project-description">{product.description}</p>
                  <span className="project-meta">
                    <span className="project-destination">{product.destination}</span>
                    <span
                      className={`project-status${product.href ? "" : " is-building"}`}
                    >
                      {product.status}
                    </span>
                    {product.href ? <Arrow /> : null}
                  </span>
                </>
              );

              return product.href ? (
                <a
                  className="project-row"
                  href={product.href}
                  key={product.name}
                  aria-labelledby={`product-${product.number}`}
                >
                  {content}
                </a>
              ) : (
                <article
                  className="project-row is-static"
                  key={product.name}
                  aria-labelledby={`product-${product.number}`}
                >
                  {content}
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="site-footer container">
        <p>
          Useful software, made independently.
          <span> Care lives in the details.</span>
        </p>
        <div className="footer-meta">
          <span>ND SOFT LLC / 2026</span>
          <span>Arizona, USA</span>
          <a href="#top">Back to top</a>
        </div>
      </footer>
    </div>
  );
}
