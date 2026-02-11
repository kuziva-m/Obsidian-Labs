import { useState } from "react";
import {
  Plus,
  Minus,
  Truck,
  Clock,
  MapPin,
  Hash,
  ShieldCheck,
  ThermometerSnowflake,
  Ban,
  Dna,
  AlertOctagon,
  ChevronDown,
} from "lucide-react";
import SEO from "../components/SEO";
import "./FAQ.css";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      icon: <MapPin size={22} />,
      q: "Where do you ship from?",
      a: "We ship all orders from our warehouse in Melbourne, Australia.",
    },
    {
      icon: <Clock size={22} />,
      q: "How long does it take to receive my order?",
      a: "All in-stock orders are dispatched within 24 business hours of payment. Typically, orders take 1–5 business days to arrive depending on your location.",
    },
    {
      icon: <Hash size={22} />,
      q: "Do I get a tracking number?",
      a: "Yes, all orders are sent with an Australia Post tracking number.",
    },
    {
      icon: <ShieldCheck size={22} />,
      q: "What happens if my order doesn’t arrive?",
      a: "In the unlikely event your order does not arrive, we offer a full reship of your order. As we ship all orders domestically within Australia, there are no customs issues.",
    },
    {
      icon: <Truck size={22} />,
      q: "Are packages sent securely?",
      a: "Yes, all packages are sent with privacy and discretion in mind to ensure the safety and confidentiality of your order.",
    },
    {
      icon: <Dna size={22} />,
      q: "Does your shipping method protect the peptides?",
      a: "Yes, all peptides are supplied lyophilised (freeze-dried) and packaged to protect them from heat and direct sunlight, helping preserve product integrity during transit.",
    },
    {
      icon: <Ban size={22} />,
      q: "Can I cancel my order?",
      a: "If your order has not yet been dispatched, you may cancel it for a full refund.",
    },
    {
      icon: <ThermometerSnowflake size={22} />,
      q: "How should I store my peptides?",
      a: "Once reconstituted, peptides should be stored under refrigerated conditions. Reconstituted peptides typically remain stable for a minimum of 4 weeks when stored correctly.",
    },
    {
      icon: <ShieldCheck size={22} />,
      q: "What purity are your peptides?",
      a: "Our peptides are manufactured to 99%+ purity standards and are screened for heavy metals and other contaminants. We work with reputable manufacturers and conduct regular third-party laboratory testing to maintain high quality standards.",
    },
  ];

  return (
    <div className="faq-page">
      <SEO title="FAQ - Obsidian Labs" />

      <section className="faq-header-section">
        <div className="container">
          <h1 className="faq-main-title font-oswald">
            SUPPORT <span className="text-red">&</span> KNOWLEDGE
          </h1>
          <p className="faq-intro font-mono">
            Precision guidance for professional research.
          </p>
        </div>
      </section>

      <section className="faq-accordion-section">
        <div className="container max-w-4xl">
          <div className="faq-list">
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`faq-card ${openIndex === index ? "is-open" : ""}`}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="faq-card-header">
                  <div className="faq-question-side">
                    <div className="faq-icon">{item.icon}</div>
                    <h3 className="font-oswald">{item.q}</h3>
                  </div>
                  <div className="faq-chevron">
                    <ChevronDown size={24} />
                  </div>
                </div>

                <div className="faq-card-body">
                  <div className="faq-answer-text">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-legal-section">
        <div className="container">
          <div className="legal-notice">
            <div className="legal-header">
              <AlertOctagon size={28} className="text-red" />
              <h2 className="font-oswald uppercase">Research Disclaimer</h2>
            </div>
            <div className="legal-body font-mono">
              <p>
                All peptide compounds offered by Obsidian Labs are premium
                quality materials intended strictly for laboratory research
                purposes. None of the statements made on this website have been
                evaluated by the TGA, FDA, or any international regulatory
                authority. These products are not intended to diagnose, treat,
                cure, or prevent any disease.
              </p>
              <p className="mt-4 text-white">STRICTLY FOR RESEARCH USE ONLY.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
