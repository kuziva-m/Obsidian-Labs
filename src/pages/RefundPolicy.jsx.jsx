import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="bg-[#f4f4f5] min-h-screen py-12">
      <SEO
        title="Refund Policy - Obsidian Labs Australia"
        description="Obsidian Labs Australia strict no-refund and no-return policy."
      />

      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#ce2a34] font-mono text-sm uppercase mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="bg-white p-8 md:p-12 rounded shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert size={32} className="text-[#ce2a34]" />
            <h1 className="font-oswald text-4xl md:text-5xl uppercase text-[#1b1b1b] m-0">
              Refund Policy
            </h1>
          </div>

          <div className="h-1 w-24 bg-[#ce2a34] mb-8"></div>

          <h2 className="font-oswald text-2xl text-[#1b1b1b] uppercase tracking-wide mb-4">
            All Sales Are Final
          </h2>

          <div className="font-body text-gray-600 leading-relaxed space-y-8">
            <p className="text-lg">
              Due to the specialized nature of our products, Obsidian Labs
              Australia maintains a strict{" "}
              <strong>no-refund and no-return policy</strong>. By placing an
              order through our website, you acknowledge and agree to the terms
              outlined below.
            </p>

            <section>
              <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-2 border-b border-gray-100 pb-2">
                1. Research Use Only
              </h3>
              <p>
                All products are sold strictly for laboratory research purposes
                only. Products are not intended for human or veterinary use.
                Customers are responsible for ensuring products are suitable for
                their intended research applications prior to purchase.
              </p>
            </section>

            <section>
              <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-2 border-b border-gray-100 pb-2">
                2. No Refunds or Returns
              </h3>
              <p className="mb-3">
                We do not offer refunds, returns, or exchanges under any
                circumstances, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-[#ce2a34]">
                <li>Change of mind</li>
                <li>Incorrect product selection</li>
                <li>Improper handling, storage, or use after delivery</li>
                <li>Delays caused by shipping carriers</li>
                <li>Customs delays, seizures, or regulatory actions</li>
                <li>Personal expectations regarding product performance</li>
              </ul>
              <p className="mt-4 font-bold text-[#1b1b1b]">
                All purchases are considered final once payment has been
                completed.
              </p>
            </section>

            <section>
              <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-2 border-b border-gray-100 pb-2">
                3. Order Accuracy
              </h3>
              <p>
                Customers are solely responsible for ensuring all order
                information is correct, including shipping address and product
                selection. Orders cannot be modified or cancelled once they have
                been processed or shipped.
              </p>
            </section>

            <section>
              <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-2 border-b border-gray-100 pb-2">
                4. Damaged or Incorrect Orders
              </h3>
              <p>
                If you receive an item that is physically damaged during transit
                or an incorrect product due to our error, please contact us
                within 48 hours of delivery with photographic evidence. At our
                sole discretion, we may offer a replacement product where
                appropriate. Refunds will not be issued.
              </p>
            </section>

            <section>
              <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-2 border-b border-gray-100 pb-2">
                5. Shipping Responsibility
              </h3>
              <p>
                Once an order has been dispatched, ownership and responsibility
                transfer to the customer. We are not responsible for shipping
                delays, lost parcels, or courier-related issues. We will provide
                tracking information for all shipments.
              </p>
            </section>

            <section>
              <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-2 border-b border-gray-100 pb-2">
                6. Agreement to Terms
              </h3>
              <p>
                By purchasing from Obsidian Labs Australia, you confirm that you
                have read, understood, and agreed to this Refund Policy in full
                prior to completing your order.
              </p>
            </section>

            <section>
              <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-2 border-b border-gray-100 pb-2">
                7. Contact
              </h3>
              <p>
                For order inquiries, please contact:
                <br />
                <strong className="text-[#1b1b1b]">Email:</strong>{" "}
                <a
                  href="mailto:support@obsidianlabs-au.com"
                  className="text-[#ce2a34] hover:underline"
                >
                  support@obsidianlabs-au.com
                </a>
              </p>
            </section>

            <div className="pt-8 mt-8 border-t border-gray-200 text-sm text-gray-500 italic">
              Obsidian Labs Australia reserves the right to update or modify
              this policy at any time without prior notice.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
