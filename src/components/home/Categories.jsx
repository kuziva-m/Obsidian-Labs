import { Link } from "react-router-dom";
import { Layers, Syringe, FlaskConical } from "lucide-react";

export default function Categories() {
  return (
    <section className="py-20 bg-white border-b-2 border-gray-200">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-oswald text-4xl uppercase text-[var(--baltic-sea)] mb-4">
            Research Divisions
          </h2>
          <div className="h-1 w-20 bg-[var(--brick-red)] mx-auto"></div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Peptides - Links to Section */}
          <CategoryCard
            icon={<FlaskConical size={40} />}
            title="Peptides"
            desc="High-purity synthetic compounds for cellular research."
            link="/research-divisions#peptides"
          />

          {/* Blends - Links to Section */}
          <CategoryCard
            icon={<Layers size={40} />}
            title="Peptide Blends"
            desc="Synergistic formulations for advanced protocols."
            link="/research-divisions#blends"
          />

          {/* Supplies - Links to Section */}
          <CategoryCard
            icon={<Syringe size={40} />}
            title="Lab Supplies"
            desc="Sterile equipment and BAC water for handling."
            link="/research-divisions#supplies"
          />
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ icon, title, desc, link }) {
  return (
    <Link
      to={link}
      className="group block p-8 border-2 border-[#1b1b1b] hover:bg-[#1b1b1b] transition-all duration-300"
    >
      <div className="text-[#ce2a34] mb-6 group-hover:text-white transition-colors">
        {icon}
      </div>

      <h3 className="font-oswald text-2xl uppercase mb-3 text-[#1b1b1b] group-hover:text-white transition-colors">
        {title}
      </h3>

      <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors leading-relaxed font-bold">
        {desc}
      </p>

      <div className="mt-6 flex items-center gap-2 text-[#ce2a34] font-oswald uppercase text-sm font-bold tracking-wider group-hover:text-white">
        Learn More{" "}
        <span className="group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </Link>
  );
}
