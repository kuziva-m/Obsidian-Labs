import { Link } from "react-router-dom";
import { FlaskConical, Target, Search } from "lucide-react";
import SEO from "../components/SEO";

export default function Home() {
  return (
    <div className="page">
      <SEO title="Home" />

      {/* Top Nav */}
      <header className="topbar">
        <div className="container topbar__inner">
          <Link className="brand" to="/">
            <img
              className="brand__logo"
              src="/assets/obsidian-logo-red.png"
              alt="Obsidian Labs"
            />
            <div className="brand__text">
              <div className="brand__name">OBSIDIAN</div>
              <div className="brand__sub">LABS</div>
            </div>
          </Link>

          <nav className="nav">
            <Link className="nav__link" to="/about">
              About Us
            </Link>
            <Link className="nav__link" to="/shop">
              Services
            </Link>
            <Link className="nav__link" to="/contact">
              Contact
            </Link>
          </nav>

          <div className="topbar__actions">
            <button className="iconBtn" aria-label="Search">
              <Search size={18} />
            </button>

            <Link className="btn btn--primary" to="/contact">
              Request Consultation
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero__bg">
          <img
            className="hero__bgImg"
            src="/hero-banner.jpeg"
            alt=""
            aria-hidden="true"
          />
          <div className="hero__overlay" />
        </div>

        <div className="container hero__content">
          <img
            className="hero__mark"
            src="/assets/obsidian-logo-red.png"
            alt=""
            aria-hidden="true"
          />

          <h1 className="hero__title">Advanced Peptide Research</h1>
          <p className="hero__subtitle">
            Cutting-Edge Solutions for Your Research Needs.
          </p>

          <Link className="btn btn--cta" to="/shop">
            Explore Our Services <span aria-hidden="true">›</span>
          </Link>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="section">
        <div className="container">
          <div className="section__titleRow">
            <div className="rule" />
            <h2 className="section__title">Our Services</h2>
            <div className="rule" />
          </div>

          <div className="cards">
            {/* Card 1: Custom Icon */}
            <ServiceCard
              icon={
                <img
                  src="/assets/molecule.png" /* FIXED PATH */
                  alt="Molecule"
                  className="card__icon"
                />
              }
              title="Custom Peptide Synthesis"
              text="High-quality custom peptide synthesis tailored to your specifications."
            />

            {/* Card 2: Lucide Icon */}
            <ServiceCard
              icon={<FlaskConical size={32} />}
              title="Peptide Analysis"
              text="Comprehensive analysis and purification for accurate & reliable results."
            />

            {/* Card 3: Lucide Icon */}
            <ServiceCard
              icon={<Target size={32} />}
              title="Research & Development"
              text="Innovative R&D services to advance your peptide-related research."
            />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="aboutBand">
        <div className="container aboutBand__inner">
          <div className="aboutBand__copy">
            <h3 className="aboutBand__headline">About Us</h3>
            <h2 className="aboutBand__title">
              Precision and Excellence in Peptide Science
            </h2>
            <p className="aboutBand__text">
              At Obsidian Labs, we are dedicated to providing cutting-edge
              peptide solutions with unmatched expertise and precision. Our
              state-of-the-art facilities and experienced team ensure the
              highest level of service and your research needs.
            </p>

            <Link className="btn btn--primary" to="/about">
              Learn More <span aria-hidden="true">›</span>
            </Link>
          </div>

          <div className="aboutBand__media">
            <img
              className="aboutBand__img"
              src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80"
              alt="Research team in lab"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer__inner">
            <div className="brand">
              <img
                className="footer__logo"
                src="/assets/obsidian-logo-red.png"
                alt="Obsidian Labs"
              />
              <div className="brand__text">
                <div className="brand__name">OBSIDIAN</div>
                <div className="brand__sub">LABS</div>
              </div>
            </div>

            <div className="footer__links">
              <Link to="/privacy">Privacy Policy</Link>
              <span className="dot">•</span>
              <Link to="/terms">Terms of Service</Link>
            </div>

            <div className="footer__social">
              <a className="social" href="#" aria-label="Facebook">
                F
              </a>
              <a className="social" href="#" aria-label="Twitter">
                X
              </a>
              <a className="social" href="#" aria-label="Instagram">
                I
              </a>
            </div>
          </div>

          <div className="footer__bottom">
            © {new Date().getFullYear()} Obsidian Labs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ icon, title, text }) {
  return (
    <article className="card">
      <div className="card__iconWrap">
        {/* Render content directly */}
        {icon}
      </div>
      <h3 className="card__title">{title}</h3>
      <p className="card__text">{text}</p>
      <Link className="card__btn" to="/shop">
        Learn More <span aria-hidden="true">›</span>
      </Link>
    </article>
  );
}
