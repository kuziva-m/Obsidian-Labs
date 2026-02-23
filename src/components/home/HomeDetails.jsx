import { CheckCircle } from "lucide-react";

export default function HomeDetails() {
  return (
    <section className="bg-white py-16 border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        {/* H2 Heading */}
        <h2 className="font-oswald text-3xl md:text-4xl uppercase text-[#1b1b1b] mb-8 leading-tight">
          Trusted Research Peptide Supplier <br />
          <span className="text-[#ce2a34]">in Australia</span>
        </h2>

        {/* Body Text */}
        <div className="font-body text-gray-600 leading-relaxed space-y-6 text-lg text-justify md:text-center">
          <p>
            Obsidian Labs is an Australian-based supplier of high-purity
            synthetic peptides and laboratory research compounds. We specialise
            in providing batch-verified research peptides for analytical,
            cellular, and scientific investigation within controlled laboratory
            environments.
          </p>
          <p>
            All compounds are manufactured to stringent purity standards and
            supported by batch-specific Certificates of Analysis (COAs). Each
            lot is documented to ensure traceability, consistency, and
            transparency for professional research applications. Our internal
            quality control processes focus on compound stability, structural
            integrity, and analytical verification to maintain reliable research
            outcomes.
          </p>
          <p>
            Dispatching directly from Melbourne, Obsidian Labs provides fast
            Australia-wide shipping with secure, discreet packaging. Our
            catalogue includes individual peptides, synergistic peptide blends,
            and laboratory handling supplies intended strictly for research use.
          </p>
          <p className="font-bold text-[#1b1b1b]">
            We are committed to supporting scientific advancement by supplying
            synthetic peptide compounds for laboratory research purposes only.
            All products are not approved for human or veterinary consumption
            and must be handled in accordance with institutional laboratory
            standards.
          </p>
        </div>

        {/* Small Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          <div className="flex items-center gap-2 text-sm font-mono uppercase text-gray-500">
            <CheckCircle size={16} className="text-[#ce2a34]" /> Batch Verified
          </div>
          <div className="flex items-center gap-2 text-sm font-mono uppercase text-gray-500">
            <CheckCircle size={16} className="text-[#ce2a34]" /> HPLC Analysis
          </div>
          <div className="flex items-center gap-2 text-sm font-mono uppercase text-gray-500">
            <CheckCircle size={16} className="text-[#ce2a34]" /> Melbourne Based
          </div>
        </div>
      </div>
    </section>
  );
}
