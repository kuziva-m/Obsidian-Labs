import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function HolidayPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already dismissed this popup during their current session
    const hasSeenPopup = sessionStorage.getItem("holidayPopupDismissed");

    if (!hasSeenPopup) {
      // Add a slight 1-second delay so it pops up smoothly right after the page loads
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Save to session storage so it doesn't bother them on every page reload
    sessionStorage.setItem("holidayPopupDismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white max-w-md w-full rounded-sm shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 border-2 border-[#1b1b1b]">
        {/* Red Header Bar */}
        <div className="bg-[#ce2a34] p-6 text-center border-b-4 border-[#1b1b1b]">
          <AlertTriangle size={48} className="text-white mx-auto mb-3" />
          <h2 className="font-oswald text-2xl md:text-3xl text-white uppercase tracking-widest">
            Holiday Notice
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 text-center bg-gray-50">
          <p className="font-body text-gray-700 text-[1.1rem] leading-relaxed">
            Please note that all orders placed between{" "}
            <strong className="text-[#1b1b1b]">23 April and 2 May</strong> will
            be processed and shipped on{" "}
            <strong className="text-[#ce2a34]">3 May</strong>.
          </p>
        </div>

        {/* Footer / Button */}
        <div className="p-4 bg-white border-t border-gray-200">
          <button
            onClick={handleClose}
            className="w-full bg-[#1b1b1b] text-white py-3 font-oswald uppercase tracking-widest text-sm hover:bg-[#ce2a34] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none"
          >
            I Understand
          </button>
        </div>

        {/* Close X (Top Right) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
