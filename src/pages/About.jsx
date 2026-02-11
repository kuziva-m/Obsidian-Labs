import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  Users,
  Activity,
  Hexagon,
  ArrowRight,
} from "lucide-react";
import SEO from "../components/SEO";
import Footer from "../components/Footer";
import "./About.css";

export default function About() {
  return (
    <div className="page-wrapper">
      <SEO title="About Us - Obsidian Labs" />

      <main>
        {/* --- HERO SECTION --- */}
        <section className="about-hero-section">
          <div className="container">
            <div className="hero-content">
              <span className="hero-label">EST. 2026 • AUSTRALIA</span>
              <h1 className="hero-title">
                PRECISION SCIENCE.
                <br />
                <span className="text-red">ELEVATED STANDARDS.</span>
              </h1>
              <div className="hero-divider"></div>
              <p className="hero-text">
                Obsidian Labs specialises in supplying high-purity,
                research-grade peptides to qualified researchers and
                institutions throughout Australia. We exist to raise the
                standard of supply—delivering products backed by clarity,
                consistency, and confidence.
              </p>
            </div>
          </div>
          {/* Abstract Background Element */}
          <div className="hero-bg-pattern"></div>
        </section>

        {/* --- MISSION STRIP --- */}
        <section className="mission-section">
          <div className="container">
            <div className="mission-grid">
              <div className="mission-left">
                <h2 className="section-heading">OUR MISSION</h2>
              </div>
              <div className="mission-right">
                <p className="mission-statement">
                  To support scientific advancement by providing consistently{" "}
                  <span className="highlight">
                    high-purity research compounds
                  </span>{" "}
                  with fast, discreet shipping and responsive professional
                  support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- CORE PILLARS (Dark Mode) --- */}
        <section className="values-section">
          <div className="container">
            <h2 className="section-heading text-center mb-16">
              OPERATIONAL STANDARDS
            </h2>

            <div className="values-grid">
              {/* Card 1 */}
              <div className="value-card">
                <div className="icon-box">
                  <ShieldCheck size={32} />
                </div>
                <h3>Verified Purity</h3>
                <p>
                  Strict quality standards and rigorous testing protocols
                  ensuring a minimum purity level of 99% for all laboratory
                  research materials.
                </p>
              </div>

              {/* Card 2 */}
              <div className="value-card">
                <div className="icon-box">
                  <Truck size={32} />
                </div>
                <h3>Discreet Logistics</h3>
                <p>
                  Express delivery in plain, unbranded packaging. We understand
                  that security and reliability are paramount to your research
                  timeline.
                </p>
              </div>

              {/* Card 3 */}
              <div className="value-card">
                <div className="icon-box">
                  <Activity size={32} />
                </div>
                <h3>Research Grade</h3>
                <p>
                  Our catalogue is curated specifically for qualified
                  researchers. We do not compromise on the integrity or
                  stability of our compounds.
                </p>
              </div>

              {/* Card 4 */}
              <div className="value-card">
                <div className="icon-box">
                  <Users size={32} />
                </div>
                <h3>Local Support</h3>
                <p>
                  Proudly Australian-owned and operated. Our local team is
                  available to assist with product enquiries and technical
                  guidance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- THE STORY (Split Layout) --- */}
        <section className="story-section">
          <div className="container">
            <div className="story-wrapper">
              <div className="story-content">
                <h2 className="section-heading">THE OBSIDIAN STANDARD</h2>
                <div className="story-body">
                  <p>
                    Obsidian Labs was founded to redefine expectations within
                    the Australian research market. We recognised a gap for a
                    supplier that prioritises <strong>transparency</strong> and{" "}
                    <strong>operational professionalism</strong> above all else.
                  </p>
                  <p>
                    Inspired by Australia’s growing scientific community, our
                    objective is simple: provide researchers with materials they
                    can trust—batch after batch.
                  </p>
                  <div className="commitment-list">
                    <div className="c-item">
                      <Hexagon size={16} className="text-red" />{" "}
                      <span>Australian Owned</span>
                    </div>
                    <div className="c-item">
                      <Hexagon size={16} className="text-red" />{" "}
                      <span>Batch Consistency</span>
                    </div>
                    <div className="c-item">
                      <Hexagon size={16} className="text-red" />{" "}
                      <span>Secure Ordering</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="story-visual">
                <div className="visual-inner">
                  {/* Decorative visual element representing a molecule/structure */}
                  <div className="molecule-node n1"></div>
                  <div className="molecule-node n2"></div>
                  <div className="molecule-node n3"></div>
                  <div className="molecule-link l1"></div>
                  <div className="molecule-link l2"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA / FOOTER --- */}
        <section className="cta-section">
          <div className="container text-center">
            <h2 className="cta-title">ADVANCE YOUR RESEARCH</h2>
            <p className="cta-text">Precision matters. Choose Obsidian Labs.</p>
            <Link to="/shop" className="cta-btn">
              View Catalogue <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
