import { Link } from "react-router-dom";
import "./About.css";

export default function About() {
  return (
    <section id="about" className="aboutBand">
      <div className="container aboutBand__inner">
        <div className="aboutBand__copy">
          <h3 className="aboutBand__headline">About Us</h3>
          <h2 className="aboutBand__title">
            Precision and Excellence in Peptide Science
          </h2>
          <p className="aboutBand__text">
            At Obsidian Labs, we are dedicated to providing cutting-edge peptide
            solutions with unmatched expertise.
          </p>
          <Link className="btn btn--primary" to="/about">
            Learn More <span aria-hidden="true">›</span>
          </Link>
        </div>
        <div className="aboutBand__media">
          <img
            className="aboutBand__img"
            src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80"
            alt="Lab Team"
          />
        </div>
      </div>
    </section>
  );
}
