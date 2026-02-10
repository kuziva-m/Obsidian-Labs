import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Tag } from "lucide-react";
import SEO from "../components/SEO";
import HomeHeader from "../components/home/HomeHeader";
import Footer from "../components/Footer";
import "./Project.css";

export default function Project() {
  // --- STATE FOR GALLERY ---
  // Default to the first image.
  // You would replace these URLs with your actual lab/project images.
  const [activeImage, setActiveImage] = useState(0);

  const projectData = {
    title: "Synthesized GLP-1 Protocol Alpha",
    location: "Obsidian Main Lab, Melbourne",
    date: "October 2025",
    category: "Peptide Synthesis",
    description: [
      `This project involved the custom synthesis of a high-purity GLP-1 analogue for cellular research. 
      The process required a 99.8% purity threshold, achieved through our advanced High Performance Liquid Chromatography (HPLC) protocols.`,

      `Our team utilized solid-phase peptide synthesis (SPPS) to construct the peptide chain. 
      Special attention was given to the purification phase to remove any trifluoroacetic acid (TFA) salts, 
      ensuring the compound was suitable for sensitive biological assays.`,

      `The final product was delivered in lyophilized powder form, stable at -20°C. 
      This protocol has now become our standard for all custom Glucagon-like peptide requests, 
      guaranteeing consistent results for our research partners.`,
    ],
    images: [
      "/assets/mar01.jpg", // Replace with your actual image paths
      "/assets/mar02.jpg",
      "/assets/mar03.jpg",
      "/assets/mar04.jpg",
      "/assets/mar05.jpg",
      "/assets/mar06.jpg",
    ],
  };

  return (
    <div className="page">
      <SEO title={projectData.title} />
      <HomeHeader />

      <div className="project-container">
        {/* BREADCRUMB / BACK LINK */}
        <div className="project-nav">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} /> Back to Projects
          </Link>
        </div>

        <div className="project-grid">
          {/* --- LEFT COLUMN: CONTENT --- */}
          <div className="project-info">
            <h1 className="project-title">{projectData.title}</h1>

            <div className="project-meta">
              <span className="meta-item">
                <MapPin size={16} /> {projectData.location}
              </span>
              <span className="meta-item">
                <Calendar size={16} /> {projectData.date}
              </span>
              <span className="meta-item">
                <Tag size={16} /> {projectData.category}
              </span>
            </div>

            <div className="project-body">
              {projectData.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <Link to="/contact" className="btn btn--cta">
              Request Similar Protocol
            </Link>
          </div>

          {/* --- RIGHT COLUMN: INTERACTIVE GALLERY --- */}
          <div className="project-gallery">
            {/* Main Large Image */}
            <div className="main-image-frame">
              <img
                src={projectData.images[activeImage]}
                alt="Main Project View"
                className="main-image"
              />
            </div>

            {/* Thumbnail Grid */}
            <div className="thumbnail-grid">
              {projectData.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`thumb-btn ${activeImage === index ? "active" : ""}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumb-img"
                  />
                </button>
              ))}
            </div>

            <p className="gallery-note">
              * Images showcase the purification and synthesis process.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
