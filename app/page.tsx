const impactStats = [
  { value: "12 480", label: "familles accompagnées" },
  { value: "86 320", label: "repas distribués" },
  { value: "1 240", label: "donateurs engagés" },
];

const actions = [
  {
    number: "01",
    title: "Je donne",
    text: "Un don simple, sécurisé et suivi de bout en bout.",
    href: "#don",
    tone: "green",
  },
  {
    number: "02",
    title: "Je demande une aide",
    text: "Un accompagnement digne, confidentiel et humain.",
    href: "#aide",
    tone: "mint",
  },
  {
    number: "03",
    title: "Je deviens partenaire",
    text: "Ensemble, amplifions notre impact local.",
    href: "#partenaires",
    tone: "cream",
  },
];

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 9h11M10 4l5 5-5 5" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero" id="accueil">
        <nav className="navbar" aria-label="Navigation principale">
          <a className="brand" href="#accueil" aria-label="Solidarité, accueil">
            <span className="brand-mark"><HeartIcon /></span>
            <span>
              <strong>Solidarité</strong>
              <small>ENSEMBLE</small>
            </span>
          </a>
          <div className="nav-links">
            <a href="#mission">Notre mission</a>
            <a href="#impact">Notre impact</a>
            <a href="#aide">Besoin d&apos;aide ?</a>
          </div>
          <div className="navbar-actions">
            <a className="login-button" href="/login">Se connecter</a>
            <a className="button button-small" href="#don">
              Faire un don <ArrowIcon />
            </a>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Une solidarité qui agit</p>
            <h1>Chaque geste compte.<br /><em>Chaque famille aussi.</em></h1>
            <p className="hero-description">
              Nous créons des liens durables entre celles et ceux qui donnent,
              celles et ceux qui ont besoin d&apos;un coup de pouce, et les
              associations qui font la différence chaque jour.
            </p>
            <div className="hero-actions">
              <a className="button" href="#don">Je fais un don <ArrowIcon /></a>
              <a className="text-link" href="#mission">Découvrir notre mission <ArrowIcon /></a>
            </div>
          </div>
          <div className="hero-art" aria-label="Illustration de solidarité">
            <div className="sun" />
            <div className="art-circle circle-back" />
            <div className="art-circle circle-front">
              <span className="circle-heart"><HeartIcon /></span>
              <span className="circle-caption">ENSEMBLE<br /><b>on va plus loin</b></span>
            </div>
            <span className="spark spark-one">✦</span>
            <span className="spark spark-two">✦</span>
          </div>
        </div>
        <div className="hero-foot">
          <span>Une plateforme transparente et humaine</span>
          <span className="scroll-note">Faire défiler <span className="scroll-line" /></span>
        </div>
      </section>

      <section className="intro-section" id="mission">
        <div className="section-heading">
          <p className="eyebrow">Notre raison d&apos;être</p>
          <h2>La solidarité,<br /><span>en toute simplicité.</span></h2>
        </div>
        <div className="intro-copy">
          <p>
            Donner, recevoir de l&apos;aide ou s&apos;engager : tout commence par
            une relation de confiance. Solidarité rend chaque étape claire,
            accessible et profondément humaine.
          </p>
          <a className="text-link dark-link" href="#impact">En savoir plus sur nous <ArrowIcon /></a>
        </div>
      </section>

      <section className="actions-section" id="aide">
        <div className="section-kicker">
          <p className="eyebrow">Comment participer</p>
          <span>01 — 03</span>
        </div>
        <div className="action-grid">
          {actions.map((action) => (
            <a className={`action-card ${action.tone}`} href={action.href} key={action.number}>
              <span className="card-number">{action.number}</span>
              <div>
                <h3>{action.title}</h3>
                <p>{action.text}</p>
              </div>
              <span className="card-arrow"><ArrowIcon /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="impact-section" id="impact">
        <div className="impact-header">
          <div>
            <p className="eyebrow light-eyebrow">Notre impact en 2024</p>
            <h2>Des chiffres qui<br /><em>racontent des histoires.</em></h2>
          </div>
          <p className="impact-note">Parce que derrière chaque chiffre,<br />il y a une vie qui change.</p>
        </div>
        <div className="stats-grid">
          {impactStats.map((stat) => (
            <div className="stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="donation-section" id="don">
        <div className="donation-icon"><HeartIcon /></div>
        <p className="eyebrow">Votre générosité en action</p>
        <h2>Votre don devient une aide concrète,<br />là où elle compte vraiment.</h2>
        <p>Même un petit geste peut alléger le quotidien d&apos;une famille.<br />Chaque dinar est suivi et tracé.</p>
        <a className="button orange-button" href="#accueil">Faire un don maintenant <ArrowIcon /></a>
      </section>

      <footer className="footer" id="partenaires">
        <a className="brand footer-brand" href="#accueil">
          <span className="brand-mark"><HeartIcon /></span>
          <span><strong>Solidarité</strong><small>ENSEMBLE</small></span>
        </a>
        <p>Construire un monde plus solidaire,<br />un geste à la fois.</p>
        <span className="footer-copy">© 2024 Solidarité. Tous droits réservés.</span>
      </footer>
    </main>
  );
}
