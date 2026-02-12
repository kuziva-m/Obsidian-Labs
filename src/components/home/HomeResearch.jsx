import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Microscope } from "lucide-react";
import "./HomeResearch.css";

export default function HomeResearch() {
  return (
    <section className="home-research-section">
      <div className="container mx-auto px-4">
        <div className="research-banner">
          {/* LEFT: TEXT CONTENT */}
          <div className="research-content">
            <div className="research-tag">
              <BookOpen size={14} className="text-[#ce2a34]" />
              <span>Educational Resources</span>
            </div>

            <h2 className="font-oswald text-4xl md:text-5xl uppercase text-white mb-6 leading-tight">
              Advancing <span className="text-[#ce2a34]">Scientific</span>{" "}
              <br />
              Understanding
            </h2>

            <p className="font-inter text-gray-400 text-lg mb-8 max-w-xl leading-relaxed">
              Access our comprehensive library of peptide classifications,
              analytical testing methods, and laboratory compliance protocols.
            </p>

            <Link to="/research" className="research-btn group">
              <span className="font-oswald uppercase tracking-widest font-bold">
                Enter Library
              </span>
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform text-[#ce2a34]"
              />
            </Link>
          </div>

          {/* RIGHT: ABSTRACT VISUAL */}
          <div className="research-visual">
            <Microscope
              size={180}
              className="text-[#ce2a34] opacity-10 absolute -bottom-10 -right-10 md:opacity-20"
            />

            {/* CIRCLE WITH MOLECULE */}
            <div className="visual-circle">
              <img
                src="/molecule.png"
                alt="Molecule Structure"
                className="molecule-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
