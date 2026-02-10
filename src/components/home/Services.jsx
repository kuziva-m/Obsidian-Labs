import { Link } from "react-router-dom";
import { Layers, Syringe } from "lucide-react"; // Imported appropriate icons
import "./Services.css";

export default function Services() {
  return (
    <section id="inventory" className="section">
      <div className="container">
        <div className="section__titleRow">
          <div className="rule" />
          <h2 className="section__title">Lab Inventory</h2>
          <div className="rule" />
        </div>

        <div className="cards">
          {/* CATEGORY 1: PEPTIDES */}
          <ServiceCard
            icon={
              <img
                src="/assets/molecule.png"
                alt="Peptides"
                className="card__icon"
              />
            }
            title="Research Peptides"
            text="High-purity synthetic peptides including GLP-1s and GHRPs for rigorous cellular study."
            link="/shop?category=Peptides"
          />

          {/* CATEGORY 2: BLENDS */}
          <ServiceCard
            icon={<Layers size={36} />}
            title="Peptide Blends"
            text="Synergistic premixed compounds designed to increase efficiency in specific research protocols."
            link="/shop?category=Peptide Blends"
          />

          {/* CATEGORY 3: ACCESSORIES */}
          <ServiceCard
            icon={<Syringe size={36} />}
            title="Lab Supplies"
            text="Essential research accessories including BAC water and sterile equipment for handling."
            link="/shop?category=Accessories"
          />
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon, title, text, link }) {
  return (
    <article className="card">
      <div className="card__iconWrap">{icon}</div>
      <h3 className="card__title">{title}</h3>
      <p className="card__text">{text}</p>
      <Link className="card__btn" to={link}>
        View Catalog <span aria-hidden="true">›</span>
      </Link>
    </article>
  );
}
