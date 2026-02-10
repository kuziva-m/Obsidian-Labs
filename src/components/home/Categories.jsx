import { Link } from "react-router-dom";
import { KineticText, CurtainReveal } from "./Animations";

export default function Categories() {
  return (
    <section className="py-16 md:py-24 bg-white relative border-b border-gray-200">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="font-[Oswald] font-bold text-4xl md:text-6xl text-[var(--baltic-sea)] mb-6 uppercase leading-none">
              Research{" "}
              <span className="text-[var(--brick-red)]">Categories</span>
            </h2>
            <div className="h-1 w-16 bg-[var(--baltic-sea)] mb-8"></div>

            <div className="prose text-[var(--salt-box)] text-base md:text-lg leading-relaxed mb-8">
              <p className="mb-4">
                We recognize that in the field of research, purity is paramount.
                Unlike generic suppliers, our testing protocols are rigorous and
                transparent.
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
  );
}
