import { Link } from "react-router-dom";
import { Mail, ShieldCheck, Truck, Users } from "lucide-react";
import SEO from "../components/SEO";
// REMOVED: import HomeHeader from "../components/home/HomeHeader";
import Footer from "../components/Footer";
import "./About.css";

export default function About() {
  return (
    <div className="page">
      <SEO title="About Us - Obsidian Labs" />
      {/* REMOVED: <HomeHeader /> */}

      <main className="about-container">
        {/* --- HERO / INTRO --- */}
        <section className="about-hero">
          <div className="container">
            <h1 className="about-title">Welcome to Obsidian Labs</h1>
            <p className="about-subtitle">
              Precision Science. Elevated Standards.
            </p>
            <div className="about-divider"></div>
            <p className="about-lead">
              At Obsidian Labs, we specialise in supplying high-purity,
              research-grade peptides to qualified researchers and institutions
              throughout Australia. Proudly Australian-owned and operated, we
              are committed to uncompromising quality, strict quality control,
              and dependable professional service.
            </p>
            <p className="about-text">
              Based in Australia, our focus is simple: deliver premium research
              materials backed by precision, discretion, and integrity—without
              compromise.
            </p>
          </div>
        </section>

        {/* --- MISSION --- */}
        <section className="about-section bg-gray">
          <div className="container">
            <h2 className="section-heading">Our Mission</h2>
            <p className="about-text">
              Our mission is to support scientific advancement by providing
              consistently high-purity research compounds with fast, discreet
              shipping and responsive professional support.
            </p>
            <p className="about-text">
              We exist to raise the standard of peptide supply in
              Australia—delivering products researchers can rely on with
              clarity, consistency, and confidence.
            </p>
          </div>
        </section>

        {/* --- VALUES GRID --- */}
        <section className="about-section">
          <div className="container">
            <h2 className="section-heading text-center">What We Stand For</h2>

            <div className="values-grid">
              <div className="value-card">
                <ShieldCheck size={48} className="value-icon" />
                <h3>Verified Purity</h3>
                <p>
                  All products supplied by Obsidian Labs are manufactured to
                  strict quality standards and undergo rigorous testing
                  protocols, ensuring a minimum purity level of 99%, intended
                  exclusively for laboratory research use.
                </p>
              </div>

              <div className="value-card">
                <Truck size={48} className="value-icon" />
                <h3>Fast & Discreet Shipping</h3>
                <p>
                  All orders are dispatched via express delivery in plain,
                  unbranded packaging to ensure secure, private, and reliable
                  delivery across Australia.
                </p>
              </div>

              <div className="value-card">
                <Users size={48} className="value-icon" />
                <h3>Professional Support</h3>
                <p>
                  Our knowledgeable support team is available to assist with
                  product enquiries, order guidance, and after-sales support. We
                  understand that precision matters—so does your experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- STORY --- */}
        <section className="about-section bg-gray">
          <div className="container">
            <h2 className="section-heading">Our Story</h2>
            <p className="about-text">
              Obsidian Labs was founded with a clear purpose: to redefine
              expectations within the Australian research peptide market.
            </p>
            <p className="about-text">
              We recognised the need for a supplier that prioritises
              transparency, consistency, and operational professionalism. Built
              on those principles, Obsidian Labs reflects a commitment to
              elevated standards and dependable supply.
            </p>
            <p className="about-text">
              Inspired by Australia’s growing scientific and research community,
              our team is driven by one objective: provide researchers with
              materials they can trust—batch after batch.
            </p>
            <p className="about-text font-bold">
              Every product represents our dedication to precision, integrity,
              and the advancement of research.
            </p>
          </div>
        </section>

        {/* --- COMMITMENT --- */}
        <section className="about-section">
          <div className="container">
            <div className="commitment-box">
              <h2 className="section-heading">Our Commitment to You</h2>
              <ul className="commitment-list">
                <li>Australian-owned and locally dispatched</li>
                <li>High-purity research materials</li>
                <li>Strict quality control and batch consistency</li>
                <li>Secure and streamlined ordering</li>
                <li>Responsive, knowledgeable support</li>
              </ul>
              <p className="about-text mt-4">
                Whether you operate within a university, laboratory, or
                independent research setting, Obsidian Labs is committed to
                supporting your work with professionalism and reliability.
              </p>
            </div>
          </div>
        </section>

        {/* --- FOOTER CTA --- */}
        <section className="about-footer">
          <div className="container text-center">
            <h2 className="section-heading text-white">
              Thank You for Choosing Obsidian Labs
            </h2>
            <p className="about-text text-white/80">
              Your research demands precision and reliability. We are proud to
              support your scientific pursuits.
            </p>
            <a href="mailto:ObsidianLabsAU@gmail.com" className="contact-link">
              <Mail size={20} /> ObsidianLabsAU@gmail.com
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
