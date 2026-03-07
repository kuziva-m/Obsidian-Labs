import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Microscope,
  ShieldAlert,
  BookOpen,
  FlaskConical,
  ScrollText,
  Home,
  ShoppingBag,
} from "lucide-react";
import SEO from "../components/SEO";

export default function ResearchLibrary() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#f4f4f5] min-h-screen pb-20">
      <SEO title="Research Library - Obsidian Labs" />

      {/* --- HERO HEADER --- */}
      <div className="bg-[#1b1b1b] text-white py-24 px-4 relative overflow-hidden border-b-4 border-[#ce2a34]">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#ce2a34]/20 border border-[#ce2a34] px-4 py-1 rounded-full mb-6">
            <BookOpen size={14} className="text-[#ce2a34]" />
            <span className="font-mono text-xs uppercase tracking-widest text-gray-300 font-bold">
              Educational Resources
            </span>
          </div>

          <h1 className="font-oswald text-5xl md:text-6xl uppercase font-bold mb-6 tracking-wide leading-tight">
            Research <span className="text-[#ce2a34]">Library</span>
          </h1>

          <p className="font-body text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Advancing scientific understanding through structured research
            information. A resource hub for laboratories, academic environments,
            and analytical researchers.
          </p>

          {/* --- NEW ACTION BUTTONS --- */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-8 py-3 w-full sm:w-auto bg-transparent border border-gray-600 text-white font-oswald uppercase tracking-widest text-sm hover:border-white hover:bg-white hover:text-[#1b1b1b] transition-all duration-300 rounded"
            >
              <Home size={16} /> Home
            </Link>
            <Link
              to="/products"
              className="flex items-center justify-center gap-2 px-8 py-3 w-full sm:w-auto bg-[#ce2a34] text-white font-oswald uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 rounded"
            >
              <ShoppingBag size={16} /> Shop Now
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-10 relative z-20">
        {/* --- MAIN INTRO CARD --- */}
        <div className="bg-white p-8 md:p-12 shadow-lg rounded-sm border-t-4 border-[#1b1b1b] mb-16">
          <h2 className="font-oswald text-3xl uppercase text-[#1b1b1b] mb-6 flex items-center gap-3">
            <Microscope size={28} className="text-[#ce2a34]" />
            Scientific Context
          </h2>
          <div className="font-body text-gray-600 leading-relaxed space-y-4">
            <p>
              Obsidian Labs maintains a growing research library designed to
              support laboratories, academic environments, and analytical
              researchers seeking structured information on synthetic research
              peptides and related laboratory materials.
            </p>
            <p>
              This resource hub provides educational content focused on compound
              classification, quality standards, storage considerations, and
              general research context. All materials published within this
              library are intended strictly for informational and scientific
              reference purposes. Obsidian Labs does not provide medical advice,
              clinical guidance, or therapeutic claims regarding any compound
              supplied.
            </p>
            <p className="font-bold text-[#1b1b1b]">
              Our commitment is to clarity, documentation transparency, and
              compliance with professional laboratory standards across
              Australia.
            </p>
          </div>
        </div>

        {/* --- GRID SECTIONS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* ARTICLE BLOCK 1 */}
          <ArticleBlock
            title="What Are Research Peptides?"
            icon={<FlaskConical size={24} />}
          >
            <p>
              Research peptides are short chains of amino acids synthesised for
              investigative, analytical, and laboratory applications. These
              compounds are commonly utilised in academic research, biochemical
              analysis, and pre-clinical study environments.
            </p>
            <p className="mt-4">
              Within controlled laboratory settings, researchers examine peptide
              structure, stability, binding characteristics, and molecular
              interactions. Synthetic peptides are typically supplied in
              lyophilised powder form to maintain compound integrity during
              storage and transport.
            </p>
            <ComingSoonBadge label="Full Article Coming Soon" />
          </ArticleBlock>

          {/* ARTICLE BLOCK 2 */}
          <ArticleBlock
            title="Quality Standards & Purity"
            icon={<FileText size={24} />}
          >
            <p>
              Maintaining purity and batch consistency is critical in laboratory
              environments. Research compounds supplied by Obsidian Labs are
              manufactured to ≥99% purity standards and undergo quality control
              verification.
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-1 text-sm font-bold text-gray-500">
              <li>Purity percentage verification</li>
              <li>Analytical testing methods</li>
              <li>Batch identification tracking</li>
            </ul>
            <ComingSoonBadge label="Read: Understanding COAs" />
          </ArticleBlock>
        </div>

        {/* --- WIDE SECTION: STORAGE --- */}
        <div className="bg-[#1b1b1b] text-white p-10 rounded-sm mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <FlaskConical size={200} />
          </div>

          <div className="relative z-10 max-w-3xl">
            <h2 className="font-oswald text-3xl uppercase text-white mb-6 border-l-4 border-[#ce2a34] pl-6">
              Lyophilised Compounds & Stability
            </h2>
            <div className="font-body text-gray-300 leading-relaxed space-y-4">
              <p>
                Most synthetic research peptides are supplied in lyophilised
                (freeze-dried) format. Lyophilisation enhances compound
                stability by removing moisture under controlled conditions,
                supporting extended shelf integrity when stored according to
                laboratory best practices.
              </p>
              <p>
                Proper storage conditions are essential for maintaining compound
                stability in professional research settings. Handling and
                storage recommendations are provided for informational purposes
                only and should align with established laboratory protocols.
              </p>
            </div>
            <div className="mt-8 inline-block px-4 py-2 border border-gray-600 rounded text-xs uppercase tracking-widest text-gray-400">
              Technical Guide Pending
            </div>
          </div>
        </div>

        {/* --- COMPLIANCE NOTICE --- */}
        <div className="bg-red-50 border-l-4 border-[#ce2a34] p-8 mb-16">
          <div className="flex items-start gap-4">
            <ShieldAlert
              className="text-[#ce2a34] flex-shrink-0 mt-1"
              size={32}
            />
            <div>
              <h3 className="font-oswald text-xl uppercase text-[#ce2a34] mb-2 font-bold">
                Important Compliance Notice
              </h3>
              <p className="font-body text-gray-700 text-sm leading-relaxed mb-4">
                All compounds supplied by Obsidian Labs are strictly for
                laboratory research use only.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs text-red-800 font-bold uppercase">
                <li className="flex items-center gap-2">
                  <span>•</span> Not for human consumption
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span> Not therapeutic products
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span> Not listed medicines
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span> Not for diagnostic use
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- EXPLORE TOPICS --- */}
        <div className="text-center mb-20">
          <h2 className="font-oswald text-3xl uppercase text-[#1b1b1b] mb-8">
            Explore Future Topics
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Peptide Classifications",
              "Analytical Testing",
              "Storage Best Practices",
              "Terminology Glossary",
              "Documentation Standards",
            ].map((topic, i) => (
              <span
                key={i}
                className="px-6 py-3 bg-white border border-gray-200 shadow-sm text-gray-600 font-oswald uppercase text-sm tracking-wide"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS for layout cleanliness ---

function ArticleBlock({ title, icon, children }) {
  return (
    <div className="bg-white p-8 shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
        <div className="text-[#ce2a34]">{icon}</div>
        <h3 className="font-oswald text-xl uppercase text-[#1b1b1b]">
          {title}
        </h3>
      </div>
      <div className="font-body text-gray-600 leading-relaxed text-sm flex-grow">
        {children}
      </div>
    </div>
  );
}

function ComingSoonBadge({ label }) {
  return (
    <div className="mt-6 pt-4 border-t border-dashed border-gray-200 flex justify-between items-center group cursor-not-allowed">
      <span className="font-oswald uppercase text-xs font-bold text-gray-400 tracking-wider">
        {label}
      </span>
      <ScrollText size={16} className="text-gray-300" />
    </div>
  );
}
