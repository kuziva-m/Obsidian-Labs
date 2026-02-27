import { AlertTriangle } from "lucide-react";

export default function HomeDisclaimer() {
  return (
    <section className="bg-[#f4f4f5] py-16 border-t border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-8 md:p-10 rounded shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <AlertTriangle className="text-[#ce2a34]" size={28} />
            <h2 className="font-oswald text-2xl md:text-3xl uppercase text-[#1b1b1b] m-0">
              Research Use Only Disclaimer
            </h2>
          </div>

          <div className="font-body text-gray-600 leading-relaxed space-y-4 text-sm md:text-base text-justify md:text-left">
            <p>
              All products available on this website are supplied strictly for{" "}
              <strong className="text-[#1b1b1b]">
                laboratory research purposes only
              </strong>
              . They are not intended for human or animal use, including but not
              limited to therapeutic, diagnostic, cosmetic, agricultural, or
              food applications.
            </p>

            <p>
              These materials are not medicines, therapeutic goods, or medical
              devices and have not been evaluated by the Australian Therapeutic
              Goods Administration (TGA). They are not listed or registered on
              the Australian Register of Therapeutic Goods (ARTG).
            </p>

            <p className="font-bold text-[#1b1b1b] pt-2">
              By purchasing from this website, the customer acknowledges that:
            </p>

            <ul className="list-disc pl-5 space-y-2 marker:text-[#ce2a34]">
              <li>
                Products will be used solely for in-vitro laboratory research
                conducted by qualified professionals.
              </li>
              <li>
                Products will not be used for human consumption, injection,
                ingestion, or any form of administration to humans or animals.
              </li>
              <li>
                The purchaser is responsible for ensuring compliance with all
                applicable local, state, and federal laws and regulations
                regarding the handling and use of research materials.
              </li>
              <li>
                Any information provided on this website is for educational and
                research reference only and does not constitute medical advice,
                health claims, or instructions for use in humans.
              </li>
            </ul>

            <p className="pt-2 italic">
              The seller assumes no liability for misuse, improper handling, or
              use outside of stated research purposes.
            </p>

            <div className="text-center pt-6 mt-6 border-t border-gray-100">
              <span className="font-oswald text-[#ce2a34] font-bold uppercase tracking-widest text-lg">
                For professional laboratory use only.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
