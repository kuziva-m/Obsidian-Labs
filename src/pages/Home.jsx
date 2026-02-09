import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Beaker, Shield, Syringe } from "lucide-react";
import SEO from "../components/SEO";

// --- ANIMATION COMPONENTS ---

function KineticText({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("active"), delay);
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div className="overflow-hidden">
      <span ref={ref} className={`kinetic-text block ${className}`}>
        {children}
      </span>
    </div>
  );
}

function CurtainReveal({ src, alt, className = "" }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

// --- NEW COMPONENT: PEPTIDE CAROUSEL ---
function PeptideCarousel() {
  // Assuming images are directly in /public folder (e.g. public/1.png)
  const images = ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png"];

  return (
    <div className="w-full max-w-2xl overflow-hidden mb-8 border-y border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="flex animate-marquee gap-8 py-4 w-max hover:cursor-pointer">
        {[...images, ...images, ...images].map((src, i) => (
          <div
            key={i}
            className="relative group w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-center transition-colors hover:border-[var(--brick-red)]"
          >
            <img
              src={src}
              alt={`Peptide ${i}`}
              // UPDATED: Removed 'filter grayscale opacity-70'
              // Images are now always full color
              className="w-full h-full object-contain transition-all duration-500 transform group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN PAGE ---

export default function Home() {
  return (
    <div className="bg-[#f0f4f8] overflow-x-hidden">
      <SEO title="Home" />

      {/* HERO SECTION */}
      <header className="relative min-h-[90vh] flex items-center bg-[var(--baltic-sea)]">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1579165466741-7f35e4755652?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale"></div>

        <div className="relative z-10 container-custom pt-24 pb-12">
          <div className="max-w-5xl">
            {/* 1. TOP LABEL */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[2px] w-8 md:w-12 bg-[var(--brick-red)]"></div>
              <span className="text-[var(--brick-red)] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs">
                Est. 2026 • Research Protocols
              </span>
            </div>

            {/* 2. CAROUSEL (Now Full Color) */}
            <PeptideCarousel />

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
                Precision peptides for rigorous research. We provide 99% purity
                guaranteed compounds for laboratory use.
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

      {/* CATEGORY GRID */}
      <section className="py-16 md:py-24 bg-white relative border-b border-gray-200">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-[Oswald] font-bold text-4xl md:text-6xl text-[var(--baltic-sea)] mb-6 uppercase leading-none">
                Research{" "}
                <span className="text-[var(--brick-red)]">Categories</span>
              </h2>
              <div className="h-1 w-16 bg-[var(--baltic-sea)] mb-8"></div>

              <div className="prose text-[var(--salt-box)] text-base md:text-lg leading-relaxed mb-8">
                <p className="mb-4">
                  We recognize that in the field of research, purity is
                  paramount. Unlike generic suppliers, our testing protocols are
                  rigorous and transparent.
                </p>
                <p className="font-bold text-[var(--baltic-sea)] border-l-4 border-[var(--brick-red)] pl-4 py-2 bg-gray-50 text-sm md:text-base">
                  "We do not aspire to be the biggest in our industry… only the
                  BEST!"
                </p>
              </div>

              <Link
                to="/shop"
                className="inline-block px-8 py-4 bg-[var(--baltic-sea)] text-white font-[Oswald] uppercase tracking-widest text-xs hover:bg-[var(--brick-red)] transition-colors w-full sm:w-auto text-center"
              >
                Explore All Compounds
              </Link>
            </div>

            <div className="h-[300px] md:h-[500px] w-full order-1 lg:order-2">
              <CurtainReveal
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80"
                alt="Lab Equipment"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEMS / SERVICES SECTION */}
      <section className="py-16 md:py-24 bg-[var(--baltic-sea)] text-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-800 pb-8 gap-4">
            <div>
              <span className="text-[var(--brick-red)] font-bold uppercase tracking-[0.2em] text-xs mb-2 block">
                Lab Inventory
              </span>
              <h2 className="font-[Oswald] text-4xl md:text-7xl uppercase leading-none">
                Available
                <br />
                Compounds
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-800 border border-gray-800">
            {/* CARD 1 */}
            <TiltCard
              icon={<Beaker size={40} />}
              title="Peptides"
              desc="GLP-1s, GHRPs, and Synthetic peptides for cellular research."
              link="/shop?category=Peptides"
            />
            {/* CARD 2 */}
            <TiltCard
              icon={<Shield size={40} />}
              title="Blends"
              desc="Synergistic compounds premixed for specific protocol testing."
              link="/shop?category=Peptide Blends"
            />
            {/* CARD 3 */}
            <TiltCard
              icon={<Syringe size={40} />}
              title="Supplies"
              desc="BAC Water and sterile equipment for laboratory handling."
              link="/shop?category=Accessories"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function TiltCard({ icon, title, desc, link }) {
  return (
    <Link
      to={link}
      className="group relative bg-[var(--baltic-sea)] p-8 md:p-12 hover:bg-[var(--brick-red)] transition-colors duration-300 border border-white/5 block"
    >
      <div className="mb-6 text-[var(--brick-red)] group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="font-[Oswald] text-2xl md:text-3xl uppercase mb-3 text-white">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed group-hover:text-white/90">
        {desc}
      </p>
    </Link>
  );
}
