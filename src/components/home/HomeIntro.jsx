import { ShieldCheck } from "lucide-react";

export default function HomeIntro() {
  return (
    <section className="bg-white py-16 border-b border-gray-100">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        {/* Badge / Label */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-full mb-6">
          <ShieldCheck size={14} className="text-[#ce2a34]" />
          <span className="text-[#ce2a34] font-mono text-xs uppercase font-bold tracking-widest">
            Verified Australian Supplier
          </span>
        </div>

        {/* SEO Heading */}
        <h1 className="font-oswald text-4xl md:text-5xl uppercase text-[#1b1b1b] mb-6 leading-tight">
          High-Purity Research Peptides <br />
          <span className="text-[#ce2a34]">Australia</span> | Obsidian Labs
        </h1>

        {/* Description Text */}
        <p className="font-body text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          Obsidian Labs supplies high-purity research peptides and blends for
          laboratory use only. Batch-verified purity, COA documentation, and
          fast Australia-wide dispatch from Melbourne.
        </p>

        {/* Decorative Divider */}
        <div className="w-24 h-1 bg-[#1b1b1b] mx-auto mt-10"></div>
      </div>
    </section>
  );
}
