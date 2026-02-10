import { Link } from "react-router-dom";
import { ArrowRight, Microscope, ShieldCheck, Zap } from "lucide-react";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero-section">
      {/* Background Grid Pattern */}
      <div className="hero-grid-bg"></div>

      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
        {/* UPDATED: Changed items-center to items-start for precise desktop alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* --- LEFT COLUMN: CONTENT --- */}
          <div className="lg:col-span-7 flex flex-col gap-6 pt-10">
            {/* Title Row + Mobile Image */}
            <div className="flex flex-row items-center gap-4 sm:gap-6">
              {/* MOBILE ONLY: Molecule moved to LEFT */}
              <img
                src="/molecule.png"
                alt="Molecule"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain opacity-90 lg:hidden animate-float flex-shrink-0"
              />

              <h1 className="hero-title">
                Precision <br />
                <span className="text-outline">Research Protocols</span>
              </h1>
            </div>

            {/* Description */}
            <p className="hero-desc">
              Obsidian Labs supplies high-purity, HPLC-verified peptide
              compounds exclusively for laboratory research. Australian owned,
              domestically dispatched, and uncompromising on quality.
            </p>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 border-y border-gray-800 py-6 my-2">
              <div className="spec-item">
                <ShieldCheck
                  size={24}
                  className="text-[var(--brick-red)] mb-2"
                />
                <span className="spec-label">Purity</span>
                <span className="spec-value">&gt;99%</span>
              </div>
              <div className="spec-item">
                <Microscope
                  size={24}
                  className="text-[var(--brick-red)] mb-2"
                />
                <span className="spec-label">Grade</span>
                <span className="spec-value">Research</span>
              </div>
              <div className="spec-item">
                <Zap size={24} className="text-[var(--brick-red)] mb-2" />
                <span className="spec-label">Shipping</span>
                <span className="spec-value">Express</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link to="/shop" className="btn-hero-primary">
                Access Catalog
              </Link>
              <Link to="/about" className="btn-hero-secondary">
                Lab Data <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* --- RIGHT COLUMN: DESKTOP VISUAL --- */}
          {/* UPDATED: Added mt-24 to align vertically with "Research Protocols" */}
          <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center mt-24">
            {/* Decorative Circle */}
            <div className="absolute w-[400px] h-[400px] border border-gray-800 rounded-full animate-spin-slow opacity-30"></div>
            <div className="absolute w-[300px] h-[300px] border border-dashed border-[var(--brick-red)] rounded-full animate-reverse-spin opacity-20"></div>

            {/* Desktop Molecule Image */}
            <img
              src="/molecule.png"
              alt="Peptide Structure"
              className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
