import { useState, useEffect } from "react";
import { ShieldAlert, ExternalLink, XCircle, CheckCircle2 } from "lucide-react";
import "./AgeVerification.css";

export default function AgeVerification() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem("obsidian_age_verified");
    if (!isVerified) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleEntry = () => {
    if (isAgeConfirmed && isTermsAgreed) {
      localStorage.setItem("obsidian_age_verified", "true");
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }
  };

  const handleExit = () => {
    window.location.href = "https://www.google.com";
  };

  if (!isVisible) return null;

  return (
    <div className="age-gate-overlay">
      <div className="age-gate-card">
        {/* Top Header */}
        <div className="age-gate-header">
          <ShieldAlert className="text-red" size={28} />
          <h2 className="font-oswald">ENTRY PROTOCOL // AGE VERIFICATION</h2>
        </div>

        <div className="age-gate-body">
          <p className="age-gate-warning font-mono">
            RESEARCH REPOSITORY ACCESS: CONFIRM IDENTITY AND INTENT
          </p>

          <div className="age-gate-options">
            {/* Age Confirmation */}
            <label
              className={`age-gate-option ${isAgeConfirmed ? "is-active" : ""}`}
            >
              <input
                type="checkbox"
                checked={isAgeConfirmed}
                onChange={() => setIsAgeConfirmed(!isAgeConfirmed)}
              />
              <div className="age-gate-checkbox">
                {isAgeConfirmed && <CheckCircle2 size={16} />}
              </div>
              <span className="font-oswald uppercase text-sm tracking-wide">
                I confirm I am 21+ years of age or older.
              </span>
            </label>

            {/* Terms Agreement */}
            <label
              className={`age-gate-option align-start ${isTermsAgreed ? "is-active" : ""}`}
            >
              <input
                type="checkbox"
                checked={isTermsAgreed}
                onChange={() => setIsTermsAgreed(!isTermsAgreed)}
              />
              <div className="age-gate-checkbox mt-1">
                {isTermsAgreed && <CheckCircle2 size={16} />}
              </div>
              <span className="age-gate-legal font-manrope">
                I agree that products and information on this website are
                provided for
                <strong className="text-white">
                  {" "}
                  laboratory research use only
                </strong>{" "}
                and are not intended for use in or on humans or animals. I will
                not use any products or information from this website for
                diagnosis, treatment, cure, or prevention of any condition. I
                agree to follow applicable laws and regulations, and I agree to
                the Terms of Service and Privacy Policy.
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="age-gate-footer">
          <button className="age-btn-exit font-oswald" onClick={handleExit}>
            <XCircle size={18} />
            TERMINATE SESSION
          </button>

          <button
            className="age-btn-enter font-oswald"
            disabled={!isAgeConfirmed || !isTermsAgreed}
            onClick={handleEntry}
          >
            I AGREE & ENTER
            <ExternalLink size={18} />
          </button>
        </div>

        <div className="age-gate-footer-tag font-mono">
          SECURE ACCESS PORTAL // OBSIDIAN LABS AU
        </div>
      </div>
    </div>
  );
}
