import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  FlaskConical,
  Layers,
  Syringe,
  ArrowRight,
  ShieldCheck,
  Microscope,
} from "lucide-react";
import SEO from "../components/SEO";

export default function ResearchDivisions() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="bg-white min-h-screen">
      <SEO title="Research Divisions - Obsidian Labs" />

      {/* --- HERO HEADER --- */}
      <div className="bg-[#1b1b1b] text-white py-32 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(/assets/hero-bg.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="font-oswald text-5xl md:text-7xl uppercase font-bold mb-6 tracking-wide">
            Research <span className="text-[#ce2a34]">Divisions</span>
          </h1>
          <p className="font-body text-xl text-gray-400 max-w-2xl mx-auto">
            Explore our specialized categories for advanced laboratory
            applications.
          </p>
        </div>
      </div>

      {/* --- SECTION 1: PEPTIDES --- */}
      <section
        id="peptides"
        className="py-24 border-b border-gray-100 overflow-hidden relative"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual Side (Left) */}
            <div className="relative h-[400px] bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-xl group">
              <div className="absolute inset-0 bg-[#ce2a34]/5 group-hover:bg-[#ce2a34]/10 transition-colors duration-500"></div>
              {/* CSS Molecule Pattern */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <FlaskConical size={200} className="text-[#ce2a34]" />
              </div>
              <div className="absolute bottom-6 left-6 bg-white px-4 py-2 border-l-4 border-[#ce2a34] shadow-sm">
                <span className="font-oswald uppercase font-bold text-[#1b1b1b]">
                  HPLC Verified Purity
                </span>
              </div>
            </div>

            {/* Content Side (Right) */}
            <div>
              <div className="flex items-center gap-3 mb-4 text-[#ce2a34]">
                <Microscope size={24} />
                <span className="font-oswald uppercase tracking-widest text-sm font-bold">
                  Category 01
                </span>
              </div>
              <h2 className="font-oswald text-4xl uppercase text-[#1b1b1b] mb-6 leading-tight">
                Research Peptides Australia – <br />
                High-Purity Laboratory Compounds
              </h2>
              <div className="font-body text-gray-600 space-y-4 leading-relaxed text-lg">
                <p>
                  Obsidian Labs supplies high-purity synthetic research peptides
                  formulated for advanced laboratory and scientific
                  applications. All compounds are manufactured to stringent
                  quality standards and supplied as lyophilised powders to
                  maintain stability and integrity during storage and transport.
                </p>
                <p>
                  Each batch undergoes quality control procedures, with
                  Certificates of Analysis (COAs) available to verify purity and
                  composition. Our peptides are intended strictly for laboratory
                  research use only and are not approved for human or veterinary
                  consumption.
                </p>
                <p>
                  From our Melbourne dispatch facility, we provide secure,
                  discreet Australia-wide express shipping to support
                  researchers requiring reliable access to premium research
                  compounds.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  to="/shop?category=Peptides"
                  className="inline-flex items-center gap-2 bg-[#1b1b1b] text-white px-8 py-3 font-oswald uppercase tracking-widest hover:bg-[#ce2a34] transition-colors"
                >
                  View Peptide Catalog <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: BLENDS --- */}
      <section
        id="blends"
        className="py-24 bg-[#f9fafb] border-b border-gray-100 relative"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content Side (Left - Swapped for variety) */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-4 text-[#ce2a34]">
                <Layers size={24} />
                <span className="font-oswald uppercase tracking-widest text-sm font-bold">
                  Category 02
                </span>
              </div>
              <h2 className="font-oswald text-4xl uppercase text-[#1b1b1b] mb-6 leading-tight">
                Research Peptide Blends – <br />
                Precision Formulated
              </h2>
              <div className="font-body text-gray-600 space-y-4 leading-relaxed text-lg">
                <p>
                  Our research peptide blends are formulated for laboratory
                  environments requiring synergistic compound combinations. Each
                  blend is prepared to high purity standards and supplied in
                  lyophilised format to preserve compound stability.
                </p>
                <p>
                  Batch documentation and testing protocols are maintained to
                  ensure consistency and traceability across all formulations.
                  These blends are supplied strictly for laboratory research
                  purposes only and are not intended for human use.
                </p>
                <p>
                  Obsidian Labs provides fast dispatch from Melbourne with
                  Australia Post Express, ensuring reliable delivery of research
                  materials nationwide.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  to="/shop?category=Peptide Blends"
                  className="inline-flex items-center gap-2 bg-[#1b1b1b] text-white px-8 py-3 font-oswald uppercase tracking-widest hover:bg-[#ce2a34] transition-colors"
                >
                  View Blends Catalog <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Visual Side (Right) */}
            <div className="order-1 lg:order-2 relative h-[400px] bg-white rounded-lg overflow-hidden border border-gray-200 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200"></div>
              {/* Decorative Elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-64 h-64 border-2 border-[#ce2a34] rounded-full opacity-20 animate-pulse"></div>
                <div className="w-48 h-48 border-2 border-[#1b1b1b] rounded-full opacity-20 absolute top-8 left-8"></div>
              </div>
              <img
                src="/molecule.png"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 opacity-40 mix-blend-multiply"
                alt="Structure"
              />
              <div className="absolute bottom-6 right-6 bg-[#1b1b1b] text-white px-4 py-2 border-r-4 border-[#ce2a34] shadow-sm">
                <span className="font-oswald uppercase font-bold">
                  Synergistic Formulations
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: LAB SUPPLIES --- */}
      <section id="supplies" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual Side (Left) */}
            <div className="relative h-[400px] bg-[#1b1b1b] rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Syringe
                  size={150}
                  className="text-white opacity-10 rotate-45"
                />
              </div>
              <div className="absolute top-6 left-6">
                <ShieldCheck size={40} className="text-[#ce2a34]" />
              </div>
              <div className="absolute bottom-6 left-6 bg-white px-4 py-2 shadow-sm">
                <span className="font-oswald uppercase font-bold text-[#1b1b1b]">
                  Sterile Grade
                </span>
              </div>
            </div>

            {/* Content Side (Right) */}
            <div>
              <div className="flex items-center gap-3 mb-4 text-[#ce2a34]">
                <Syringe size={24} />
                <span className="font-oswald uppercase tracking-widest text-sm font-bold">
                  Category 03
                </span>
              </div>
              <h2 className="font-oswald text-4xl uppercase text-[#1b1b1b] mb-6 leading-tight">
                Laboratory Supplies for <br />
                Research Peptide Handling
              </h2>
              <div className="font-body text-gray-600 space-y-4 leading-relaxed text-lg">
                <p>
                  Obsidian Labs provides essential laboratory supplies to
                  support the proper handling and storage of research peptides.
                  Our selection includes sterile laboratory-grade materials
                  designed to assist researchers in maintaining controlled
                  environments and best-practice handling procedures.
                </p>
                <p>
                  All supplies are sourced to meet laboratory standards and are
                  intended solely for professional research settings. Orders are
                  dispatched promptly from our Melbourne facility with secure,
                  discreet packaging for Australia-wide delivery.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  to="/shop?category=Accessories"
                  className="inline-flex items-center gap-2 bg-[#1b1b1b] text-white px-8 py-3 font-oswald uppercase tracking-widest hover:bg-[#ce2a34] transition-colors"
                >
                  View Supplies Catalog <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
