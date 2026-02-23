import { useEffect, useState } from "react";
import {
  ShieldCheck,
  FileSearch,
  TestTube,
  AlertTriangle,
  FileCheck,
  ZoomIn,
  X,
  FileText, // <--- ADDED THIS MISSING IMPORT
} from "lucide-react";
import SEO from "../components/SEO";
import "./Quality.css";

// --- COA IMAGE GALLERY ---
// Reminder: Rename your uploaded WhatsApp images to 1.jpeg, 2.jpeg... etc.
// and place them in public/assets/coas/
const COA_IMAGES = [
  "/assets/coas/1.jpeg",
  "/assets/coas/2.jpeg",
  "/assets/coas/3.jpeg",
  "/assets/coas/4.jpeg",
  "/assets/coas/5.jpeg",
  "/assets/coas/6.jpeg",
  "/assets/coas/7.jpeg",
  "/assets/coas/8.jpeg",
  "/assets/coas/9.jpeg",
];

export default function Quality() {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="quality-page bg-[#f4f4f5] min-h-screen pb-20">
      <SEO title="Quality Assurance & COAs - Obsidian Labs" />

      {/* --- PAGE HEADER --- */}
      <div className="quality-header bg-[#1b1b1b] py-24 relative overflow-hidden border-b-4 border-[#ce2a34]">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-[#ce2a34]/10 rounded-full mb-6 border border-[#ce2a34]/30">
            <ShieldCheck size={32} className="text-[#ce2a34]" />
          </div>
          <h1 className="font-oswald text-4xl md:text-6xl uppercase font-bold text-white mb-6 tracking-wide leading-tight">
            Quality Assurance & <br />
            <span className="text-[#ce2a34]">Certificate Verification</span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-6xl">
        {/* --- INTRO SECTION --- */}
        <div className="bg-white p-8 md:p-12 rounded-md shadow-sm border border-gray-200 mb-12 text-center max-w-4xl mx-auto">
          <h2 className="font-oswald text-3xl uppercase text-[#1b1b1b] mb-6">
            Obsidian Labs – Quality & Transparency
          </h2>
          <div className="font-body text-gray-600 text-lg leading-relaxed space-y-4">
            <p className="font-bold text-[#ce2a34]">
              At Obsidian Labs, quality is not a marketing claim — it is a
              measurable standard.
            </p>
            <p>
              Every batch supplied undergoes rigorous internal quality control
              procedures and independent third-party laboratory analysis to
              verify identity, purity, and consistency prior to release.
            </p>
          </div>
        </div>

        {/* --- 3-COLUMN GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-md shadow-sm border-t-4 border-[#1b1b1b] hover:-translate-y-1 transition-transform">
            <TestTube size={32} className="text-[#ce2a34] mb-6" />
            <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-4">
              Our Testing Standards
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Each batch is subject to analytical verification, which may
              include:
            </p>
            <ul className="space-y-2 text-sm text-gray-700 font-mono">
              <li className="flex gap-2">
                <span className="text-[#ce2a34]">•</span> HPLC purity analysis
              </li>
              <li className="flex gap-2">
                <span className="text-[#ce2a34]">•</span> Mass spectrometry
              </li>
              <li className="flex gap-2">
                <span className="text-[#ce2a34]">•</span> Identity confirmation
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-md shadow-sm border-t-4 border-[#1b1b1b] hover:-translate-y-1 transition-transform">
            <FileText size={32} className="text-[#ce2a34] mb-6" />
            <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-4">
              What a COA Confirms
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              A Certificate of Analysis typically includes:
            </p>
            <ul className="space-y-2 text-sm text-gray-700 font-mono">
              <li className="flex gap-2">
                <span className="text-[#ce2a34]">•</span> Batch number & Date
              </li>
              <li className="flex gap-2">
                <span className="text-[#ce2a34]">•</span> Purity percentage
              </li>
              <li className="flex gap-2">
                <span className="text-[#ce2a34]">•</span> Retention time data
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-md shadow-sm border-t-4 border-[#1b1b1b] hover:-translate-y-1 transition-transform">
            <FileSearch size={32} className="text-[#ce2a34] mb-6" />
            <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-4">
              Batch Verification
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              To maintain integrity and traceability:
            </p>
            <ul className="space-y-2 text-sm text-gray-700 font-mono">
              <li className="flex gap-2">
                <span className="text-[#ce2a34]">•</span> Labels match batch IDs
              </li>
              <li className="flex gap-2">
                <span className="text-[#ce2a34]">•</span> COAs are batch-matched
              </li>
              <li className="flex gap-2">
                <span className="text-[#ce2a34]">•</span> Verify data directly
              </li>
            </ul>
          </div>
        </div>

        {/* --- IMPORTANT NOTICE --- */}
        <div className="bg-[#fef2f2] border-2 border-[#ef4444] p-6 rounded-md mb-16 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start">
          <AlertTriangle size={40} className="text-[#ef4444] flex-shrink-0" />
          <div>
            <h3 className="font-oswald text-xl uppercase font-bold text-[#b91c1c] mb-2">
              Important Notice
            </h3>
            <div className="text-[#991b1b] text-sm leading-relaxed font-body">
              <p className="mb-2">
                All products sold by Obsidian Labs are intended{" "}
                <strong>strictly for laboratory research use only.</strong> They
                are not approved for human or veterinary use.
              </p>
            </div>
          </div>
        </div>

        {/* --- COA GALLERY SECTION --- */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-16">
          <div className="bg-[#1b1b1b] px-8 py-6 border-b-4 border-[#ce2a34]">
            <h2 className="font-oswald text-2xl uppercase text-white tracking-wider flex items-center gap-3">
              <FileCheck size={24} className="text-[#ce2a34]" /> Available
              Certificates of Analysis
            </h2>
          </div>

          <div className="p-8">
            <p className="text-gray-500 text-sm mb-8 font-mono">
              The following certificates represent our current inventory
              batches. Click any document to view the full resolution analysis
              report.
            </p>

            {/* --- IMAGE GRID --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {COA_IMAGES.map((imgSrc, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer overflow-hidden rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-all h-64 md:h-80 bg-gray-100"
                  onClick={() => setSelectedImage(imgSrc)}
                >
                  <img
                    src={imgSrc}
                    alt={`Certificate ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 text-[#1b1b1b] px-4 py-2 rounded-full font-oswald text-sm uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <ZoomIn size={16} /> View
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <p className="text-xs text-gray-400 font-mono">
                More certificates are uploaded as new batches are verified.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- IMAGE MODAL (LIGHTBOX) --- */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full h-full flex flex-col items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-[#ce2a34] transition-colors bg-black/50 rounded-full p-2"
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage}
              alt="Certificate of Analysis"
              className="w-auto max-h-[85vh] object-contain rounded-sm shadow-2xl border-2 border-[#ce2a34]"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-6 text-white font-mono text-sm uppercase tracking-widest bg-black/80 px-4 py-2 rounded-full">
              Click outside to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
