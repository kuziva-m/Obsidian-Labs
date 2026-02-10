import { Link } from "react-router-dom";
import { Beaker, Shield, Syringe } from "lucide-react";

export default function Inventory() {
  return (
    <section className="py-16 md:py-24 bg-[var(--baltic-sea)] text-white">
      <div className="container mx-auto px-6 md:px-12">
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
          <TiltCard
            icon={<Beaker size={40} />}
            title="Peptides"
            desc="GLP-1s, GHRPs, and Synthetic peptides for cellular research."
            link="/shop?category=Peptides"
          />
          <TiltCard
            icon={<Shield size={40} />}
            title="Blends"
            desc="Synergistic compounds premixed for specific protocol testing."
            link="/shop?category=Peptide Blends"
          />
          <TiltCard
            icon={<Syringe size={40} />}
            title="Supplies"
            desc="BAC Water and sterile equipment for laboratory handling."
            link="/shop?category=Accessories"
          />
        </div>
      </div>
    </section>
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
