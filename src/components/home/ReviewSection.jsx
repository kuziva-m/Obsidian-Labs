import { Star, ExternalLink } from "lucide-react";

export default function ReviewSection() {
  return (
    <section className="py-24 bg-gray-50 border-t-4 border-[#1b1b1b]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-[Oswald] text-4xl md:text-5xl uppercase text-[#1b1b1b] mb-4 font-bold tracking-tight">
            Verified <span className="text-[#ce2a34]">Feedback</span>
          </h2>
          <div className="h-1 w-16 bg-[#ce2a34] mx-auto mb-6"></div>
          <p className="font-mono text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
            See what our researchers are saying about our compound purity and
            express shipping, or share your own experience.
          </p>
        </div>

        {/* Review Links Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Trustpilot Card */}
          <div className="bg-white p-8 border-2 border-[#1b1b1b] shadow-[8px_8px_0px_0px_rgba(27,27,27,1)] flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-300">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="bg-[#00b67a] p-1.5">
                  <Star size={24} fill="white" className="text-white" />
                </div>
              ))}
            </div>
            <h3 className="font-[Oswald] text-2xl uppercase mb-3 text-[#1b1b1b] font-bold tracking-wide">
              Trustpilot
            </h3>
            <p className="text-gray-600 mb-8 font-body leading-relaxed">
              Rate our service and product quality on Trustpilot. Your feedback
              drives our research forward.
            </p>
            <a
              href="https://au.trustpilot.com/review/obsidianlabs-au.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto w-full bg-[#1b1b1b] text-white py-4 font-[Oswald] uppercase tracking-widest hover:bg-[#00b67a] transition-colors flex items-center justify-center gap-3 text-sm md:text-base"
            >
              Review on Trustpilot <ExternalLink size={18} />
            </a>
          </div>

          {/* Google Card */}
          <div className="bg-white p-8 border-2 border-[#1b1b1b] shadow-[8px_8px_0px_0px_rgba(206,42,52,1)] flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-300">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={36}
                  fill="#fbbc05"
                  className="text-[#fbbc05]"
                />
              ))}
            </div>
            <h3 className="font-[Oswald] text-2xl uppercase mb-3 text-[#1b1b1b] font-bold tracking-wide">
              Google Reviews
            </h3>
            <p className="text-gray-600 mb-8 font-body leading-relaxed">
              Share your experience with Obsidian Labs Au on Google. We
              appreciate your honest public feedback.
            </p>
            <a
              href="https://g.page/r/CSErMClym0p4EBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto w-full bg-[#1b1b1b] text-white py-4 font-[Oswald] uppercase tracking-widest hover:bg-[#ce2a34] transition-colors flex items-center justify-center gap-3 text-sm md:text-base"
            >
              Review on Google <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
