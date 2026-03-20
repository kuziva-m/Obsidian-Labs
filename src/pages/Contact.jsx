import { useState } from "react";
import { supabase } from "../lib/supabase";
import SEO from "../components/SEO";
import {
  Mail,
  MapPin,
  Send,
  Loader,
  CheckCircle,
  AlertTriangle,
  MessageCircle, // Added for the WhatsApp icon
} from "lucide-react";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.from("inquiries").insert([formData]);
      if (error) throw error;
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setErrorMsg(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f4f4f5] min-h-screen py-16">
      <SEO
        title="Contact Us - Obsidian Labs"
        description="Get in touch with Obsidian Labs for research compound inquiries, support, and bulk orders."
      />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* --- PAGE HEADER --- */}
        <div className="text-center mb-16">
          <h1 className="font-oswald text-4xl md:text-5xl uppercase text-[#1b1b1b] mb-4">
            Contact <span className="text-[#ce2a34]">Obsidian Labs</span>
          </h1>
          <div className="h-1 w-20 bg-[#ce2a34] mx-auto mb-6"></div>
          <p className="text-gray-600 font-body max-w-2xl mx-auto text-lg">
            Our team is here to assist with your laboratory supply needs.
            Whether you require details on batch-verified compounds, bulk
            ordering, or shipping logistics, please reach out below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* --- LEFT: CONTACT INFO --- */}
          <div className="space-y-6">
            {/* Email Card */}
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200 flex items-start gap-4 transition-transform hover:-translate-y-1">
              <div className="bg-gray-50 text-[#ce2a34] p-4 rounded shrink-0 border border-gray-100">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-oswald uppercase text-xl text-[#1b1b1b] tracking-wide mb-1">
                  Email Support
                </h3>
                <p className="text-gray-500 font-body text-sm mb-2">
                  For order updates, COA requests, and general inquiries.
                </p>
                <a
                  href="mailto:support@obsidianlabs-au.com"
                  className="font-mono font-bold text-[#ce2a34] hover:text-[#1b1b1b] transition-colors"
                >
                  support@obsidianlabs-au.com
                </a>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200 flex items-start gap-4 transition-transform hover:-translate-y-1">
              <div className="bg-gray-50 text-[#ce2a34] p-4 rounded shrink-0 border border-gray-100">
                <MessageCircle size={24} />
              </div>
              <div>
                <h3 className="font-oswald uppercase text-xl text-[#1b1b1b] tracking-wide mb-1">
                  WhatsApp Support
                </h3>
                <p className="text-gray-500 font-body text-sm mb-2">
                  For quick questions and fast assistance from our team.
                </p>
                <a
                  href="https://wa.me/61466457201"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono font-bold text-[#ce2a34] hover:text-[#1b1b1b] transition-colors"
                >
                  Message +61 466 457 201
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200 flex items-start gap-4 transition-transform hover:-translate-y-1">
              <div className="bg-gray-50 text-[#ce2a34] p-4 rounded shrink-0 border border-gray-100">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-oswald uppercase text-xl text-[#1b1b1b] tracking-wide mb-1">
                  Dispatch Facility
                </h3>
                <p className="text-gray-500 font-body text-sm mb-2">
                  All orders are securely packaged and dispatched via Australia
                  Post Express.
                </p>
                <span className="font-mono font-bold text-[#1b1b1b]">
                  Melbourne, VIC, Australia
                </span>
              </div>
            </div>

            {/* Disclaimer Alert */}
            <div className="mt-8 bg-[#1b1b1b] text-white p-6 rounded border-l-4 border-[#ce2a34] shadow-md">
              <h4 className="font-oswald uppercase flex items-center gap-2 mb-2 tracking-widest text-red-100">
                <AlertTriangle size={18} className="text-[#ce2a34]" /> Important
                Notice
              </h4>
              <p className="text-sm font-body text-gray-300 leading-relaxed">
                Obsidian Labs supplies synthetic peptides strictly for{" "}
                <strong>in-vitro laboratory research purposes</strong>. We
                cannot and will not respond to any inquiries regarding human
                consumption, therapeutic dosages, or medical advice.
              </p>
            </div>
          </div>

          {/* --- RIGHT: CONTACT FORM --- */}
          <div className="bg-white p-8 rounded shadow-sm border border-gray-200">
            <h2 className="font-oswald text-2xl uppercase text-[#1b1b1b] mb-6 border-b border-gray-100 pb-4">
              Send a Message
            </h2>

            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded flex flex-col items-center justify-center text-center h-64">
                <CheckCircle size={48} className="mb-4 text-green-500" />
                <h3 className="font-oswald text-xl uppercase mb-2">
                  Message Received
                </h3>
                <p className="font-body text-sm">
                  Thank you for reaching out. A member of our team will get back
                  to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="bg-red-50 text-red-600 p-3 rounded text-sm flex items-center gap-2 border border-red-200">
                    <AlertTriangle size={16} /> {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded font-body focus:outline-none focus:border-[#1b1b1b] transition-colors"
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded font-body focus:outline-none focus:border-[#1b1b1b] transition-colors"
                      placeholder="researcher@lab.edu"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Subject / Order Number
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded font-body focus:outline-none focus:border-[#1b1b1b] transition-colors"
                    placeholder="e.g. COA Request for BPC-157"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded font-body focus:outline-none focus:border-[#1b1b1b] transition-colors resize-none"
                    placeholder="How can we assist you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1b1b1b] text-white font-oswald uppercase tracking-widest text-lg py-4 rounded hover:bg-[#ce2a34] transition-all flex justify-center items-center gap-2 shadow-md disabled:opacity-50"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Send size={18} /> Submit Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
