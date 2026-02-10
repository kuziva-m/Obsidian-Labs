import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { KineticText } from "./Animations"; // Import helper
import "./Hero.css"; // Ensure you use the CSS below

function PeptideCarousel() {
  const images = ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png"];

  return (
    <div className="w-full overflow-hidden border-y border-white/10 bg-black/20 backdrop-blur-sm mb-8">
      <div className="flex animate-marquee gap-8 py-4 w-max hover:cursor-pointer">
        {[...images, ...images, ...images].map((src, i) => (
          <div
            key={i}
            className="relative group w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-center transition-colors hover:border-[var(--brick-red)]"
          >
            <img
              src={src}
              alt={`Peptide ${i}`}
              className="w-full h-full object-contain transition-all duration-500 transform group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <header className="relative min-h-[90vh] flex items-center bg-[var(--baltic-sea)]">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1579165466741-7f35e4755652?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale"></div>

      <div className="relative z-10 container pt-28 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* 1. TOP LABEL */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-8 md:w-12 bg-[var(--brick-red)]"></div>
            <span className="text-[var(--brick-red)] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs">
              Est. 2026 • Research Protocols
            </span>
          </div>

          {/* 2. CAROUSEL & LOGO ROW */}
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-12">
            <div className="flex-1 w-full lg:max-w-2xl">
              <PeptideCarousel />
            </div>

            <div className="hidden lg:block flex-shrink-0">
              <div className="border border-white/10 p-4 bg-white/5 rounded-xl backdrop-blur-md">
                <img
                  src="/logo.jpeg"
                  alt="Obsidian Labs Logo"
                  className="w-48 h-auto object-contain drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

          {/* 3. MAIN TITLE */}
          <h1 className="font-[Oswald] font-bold text-5xl md:text-7xl lg:text-9xl text-white mb-6 leading-[0.9] uppercase tracking-tight">
            <KineticText>Obsidian</KineticText>
            <KineticText
              delay={200}
              className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brick-red)] to-white"
            >
              Labs AU
            </KineticText>
          </h1>

          <div className="border-l-2 border-white/20 pl-6 mb-10">
            <p className="text-base md:text-xl text-gray-400 font-light leading-relaxed max-w-xl">
              Precision peptides for rigorous research. We provide 99% purity guaranteed compounds for laboratory use.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto text-center px-8 py-4 bg-white text-[var(--baltic-sea)] font-bold font-[Oswald] uppercase tracking-widest text-sm hover:bg-[var(--brick-red)] hover:text-white transition-colors shadow-[4px_4px_0px_0px_#ce2a34]"
            >
              View Catalog
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto text-center px-8 py-4 border border-white text-white font-bold font-[Oswald] uppercase tracking-widest text-sm hover:bg-[var(--baltic-sea)] group flex items-center justify-center gap-2"
            >
              Contact Lab <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}