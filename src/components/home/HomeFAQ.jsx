import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Minus,
  ArrowRight,
  FlaskConical,
  Truck,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import "./HomeFAQ.css";

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How fast is shipping within Australia?",
      answer:
        "We dispatch all orders within 24 hours via Australia Post Express. Most metro areas receive their research materials within 1-2 business days.",
      icon: <Truck size={24} />,
    },
    {
      question: "Are your compounds third-party tested?",
      answer:
        "Yes. Every batch is HPLC tested to ensure >99% purity. We provide Certificates of Analysis (COA) for all our research compounds upon request.",
      icon: <FlaskConical size={24} />,
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept secure Bank Transfers (Osko/PayID) for instant clearance. Details are provided securely at the final stage of checkout.",
      icon: <CreditCard size={24} />,
    },
    {
      question: "Do you ship internationally?",
      answer:
        "No. We are strictly an Australian-based supplier serving verified domestic researchers only to ensure speed and compliance.",
      icon: <ShieldCheck size={24} />,
    },
  ];

  return (
    <section className="home-faq-section">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="home-faq-header">
          <h2 className="font-oswald text-4xl uppercase text-[#1b1b1b]">
            Common Inquiries
          </h2>
          <div className="h-1 w-20 bg-[#ce2a34] mt-4 mb-6"></div>
          <p className="font-inter text-gray-600 max-w-2xl text-center">
            Essential information for laboratory researchers regarding
            logistics, purity, and protocols.
          </p>
        </div>

        {/* ACCORDION */}
        <div className="home-faq-grid">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "active" : ""}`}
              onClick={() => setOpenIndex(index === openIndex ? null : index)}
            >
              <div className="faq-question">
                <div className="flex items-center gap-5">
                  {/* UPDATED: Icon is now always Red to match Categories.jsx */}
                  <span className="text-[#ce2a34]">{faq.icon}</span>
                  <h3 className="font-oswald text-lg uppercase tracking-wide text-[#1b1b1b]">
                    {faq.question}
                  </h3>
                </div>
                <span
                  className={`faq-toggle ${openIndex === index ? "text-[#ce2a34]" : "text-gray-400"}`}
                >
                  {openIndex === index ? (
                    <Minus size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                </span>
              </div>

              <div className="faq-answer">
                <p className="font-inter text-gray-600 leading-relaxed text-sm">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER LINK */}
        <div className="home-faq-footer">
          <Link to="/faq" className="view-all-btn group">
            <span className="font-oswald uppercase tracking-widest font-bold">
              View All Questions
            </span>
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
