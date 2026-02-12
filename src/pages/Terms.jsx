import { useEffect } from "react";
import { Shield, FileText } from "lucide-react";
import SEO from "../components/SEO";
import "./Terms.css";

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="terms-page">
      <SEO title="Terms of Service - Obsidian Labs" />

      {/* --- PAGE HEADER --- */}
      <div className="terms-header">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-[#ce2a34]/10 rounded-full mb-6 border border-[#ce2a34]">
            <Shield size={24} className="text-[#ce2a34]" />
          </div>
          <h1 className="font-oswald text-4xl md:text-5xl uppercase font-bold text-white mb-4 tracking-wide">
            Terms of <span className="text-[#ce2a34]">Service</span>
          </h1>
          <p className="font-body text-gray-400 max-w-2xl mx-auto">
            Please read these terms carefully before accessing or using our
            services.
          </p>
        </div>
        {/* Background Overlay */}
        <div className="terms-header-bg"></div>
      </div>

      {/* --- CONTENT --- */}
      <div className="container mx-auto px-4 py-16">
        <div className="terms-content-wrapper">
          <div className="terms-intro">
            <h2 className="font-oswald text-2xl uppercase mb-4 text-[#1b1b1b]">
              Welcome to Obsidian Labs
            </h2>
            <p>
              These Terms of Service govern your access to and use of our
              website, including all products, services, information, and
              content made available through it (collectively, the “Site”).
            </p>
            <p>
              By accessing, browsing, or purchasing from our Site, you agree to
              be bound by these Terms of Service.
            </p>
          </div>

          <hr className="terms-divider" />

          {/* SECTIONS */}
          <TermsSection number="01" title="Research Use Only">
            <p>
              All products sold by Obsidian Labs are intended strictly for
              laboratory, educational, or scientific research purposes only.
            </p>
            <p className="mt-2">
              By purchasing from this Site, you confirm and acknowledge that:
            </p>
            <ul className="terms-list">
              <li>
                You are a qualified researcher, laboratory, institution, or
                professional entity purchasing products for legitimate research
                purposes only;
              </li>
              <li>
                The products are not approved by the TGA (Therapeutic Goods
                Administration) or any other regulatory authority for human or
                animal use;
              </li>
              <li>
                You accept full responsibility for the lawful handling, storage,
                and use of all products purchased.
              </li>
            </ul>
          </TermsSection>

          <TermsSection number="02" title="Eligibility">
            <p>To purchase from this Site, you must:</p>
            <ul className="terms-list">
              <li>Be at least 18 years of age;</li>
              <li>
                Be legally capable of entering into a binding contract under
                Australian law;
              </li>
              <li>
                Agree to use all products solely for lawful research purposes
                and in compliance with all applicable laws and regulations.
              </li>
            </ul>
          </TermsSection>

          <TermsSection number="03" title="Product Information">
            <p>
              We make reasonable efforts to ensure that all product
              descriptions, specifications, pricing, and availability
              information on the Site are accurate and current. However,
              Obsidian Labs makes no warranties, express or implied, regarding
              the accuracy, completeness, or suitability of the information
              provided.
            </p>
            <ul className="terms-list">
              <li>Product images are for illustrative purposes only.</li>
              <li>Products are supplied as-is.</li>
              <li>
                Certificates of Analysis (COA) are provided where available for
                research verification purposes only.
              </li>
            </ul>
          </TermsSection>

          <TermsSection number="04" title="Orders and Payment">
            <p>
              All orders are subject to acceptance and availability. We reserve
              the right to refuse, limit, or cancel any order at our sole
              discretion, including where:
            </p>
            <ul className="terms-list">
              <li>A product is unavailable;</li>
              <li>There is a pricing or description error;</li>
              <li>
                The order appears to be intended for non-research use or
                violates these Terms.
              </li>
            </ul>
            <p className="mt-2">
              Payments are processed securely via Shopify Payments or other
              approved payment gateways. All prices are listed in Australian
              Dollars (AUD) and include GST where applicable.
            </p>
          </TermsSection>

          <TermsSection number="05" title="Shipping and Delivery">
            <p>We currently ship within Australia only.</p>
            <ul className="terms-list">
              <li>
                Orders are typically dispatched promptly and generally arrive
                within 1–3 business days, depending on location.
              </li>
              <li>
                Delivery timeframes are estimates only and not guaranteed.
              </li>
              <li>
                Obsidian Labs is not responsible for delays caused by couriers
                or circumstances beyond our control.
              </li>
              <li>
                You are responsible for ensuring shipping details are accurate.
                Incorrect information may result in delivery delays or loss.
              </li>
            </ul>
          </TermsSection>

          <TermsSection number="06" title="Returns and Refunds">
            <p>Due to the sensitive nature of research compounds:</p>
            <ul className="terms-list">
              <li>
                Returns or exchanges are not accepted once an order has been
                dispatched.
              </li>
              <li>
                Refunds may be considered only if an incorrect item was supplied
                or items arrive damaged or defective (photo evidence required).
              </li>
              <li>
                Any issues must be reported within 48 hours of receiving your
                order.
              </li>
            </ul>
          </TermsSection>

          <TermsSection number="07" title="Limitation of Liability">
            <p>To the maximum extent permitted by law:</p>
            <ul className="terms-list">
              <li>
                Obsidian Labs shall not be liable for any direct, indirect,
                incidental, or consequential damages arising from the use,
                misuse, or inability to use our products.
              </li>
              <li>
                You assume all risks associated with handling and using research
                compounds.
              </li>
              <li>
                Our total liability shall not exceed the purchase price of the
                product(s) in question.
              </li>
            </ul>
          </TermsSection>

          <TermsSection number="08" title="Intellectual Property">
            <p>
              All content on this Site — including text, images, graphics,
              logos, and product descriptions — is the intellectual property of
              Obsidian Labs or its licensors. You may not copy, reproduce,
              distribute, or exploit any content without prior written consent.
            </p>
          </TermsSection>

          <TermsSection number="09" title="Privacy and Data Protection">
            <p>Your privacy is important to us.</p>
            <ul className="terms-list">
              <li>
                Personal information is handled in accordance with our Privacy
                Policy.
              </li>
              <li>We do not store full payment card details.</li>
              <li>
                We do not sell your personal information to third parties.
              </li>
            </ul>
          </TermsSection>

          <TermsSection number="10" title="Compliance with Laws">
            <p>
              By using this Site and purchasing products, you agree to comply
              with all applicable Australian federal, state, and local laws
              relating to the purchase, storage, handling, and disposal of
              research chemicals and peptides.
            </p>
          </TermsSection>

          <TermsSection number="11" title="Amendments">
            <p>
              We reserve the right to update or modify these Terms of Service at
              any time without prior notice. Changes take effect immediately
              upon publication on this page.
            </p>
          </TermsSection>

          <TermsSection number="12" title="Contact Us">
            <p>
              For any questions or concerns regarding these Terms of Service,
              please contact Obsidian Labs via the contact form on our website
              or via our official Instagram account.
            </p>
          </TermsSection>

          {/* DISCLAIMER BOX */}
          <div className="terms-disclaimer">
            <div className="flex items-start gap-4">
              <FileText
                size={32}
                className="text-[#ce2a34] flex-shrink-0 mt-1"
              />
              <div>
                <h3 className="font-oswald text-xl uppercase font-bold text-[#ce2a34] mb-2">
                  Disclaimer
                </h3>
                <p className="font-body text-sm text-gray-700 leading-relaxed">
                  All products sold by Obsidian Labs are intended strictly for
                  laboratory research use only. They are not therapeutic goods
                  and are not for human or veterinary consumption or
                  application. By purchasing from this Site, you acknowledge and
                  agree that all products will be used solely for lawful
                  research purposes.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 text-sm text-gray-400 font-mono">
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-AU", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function TermsSection({ number, title, children }) {
  return (
    <div className="terms-section">
      <div className="section-number">{number}</div>
      <div className="section-content">
        <h3 className="font-oswald text-xl uppercase font-bold text-[#1b1b1b] mb-4">
          {title}
        </h3>
        <div className="font-body text-gray-600 leading-relaxed text-sm space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}
