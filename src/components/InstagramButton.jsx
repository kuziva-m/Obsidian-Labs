import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(true);

  const WHATSAPP_NUMBER = "61466457201";

  if (!isVisible) return null;

  return (
    <div
      className="whatsapp-float-container"
      style={{
        zIndex: 9990,
        animation: "fadeIn 0.5s ease",
      }}
    >
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: "#1b1b1b" /* Baltic Sea */,
          color: "white",
          padding: "12px 24px",
          borderRadius: "50px",
          border: "2px solid #ce2a34" /* Brick Red Accent */,
          boxShadow: "0 4px 15px rgba(206, 42, 52, 0.3)" /* Red Glow */,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
          fontWeight: "700",
          fontFamily: '"Oswald", sans-serif',
          fontSize: "0.9rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          transition: "transform 0.2s, box-shadow 0.2s",
          height: "50px",
          boxSizing: "border-box",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(206, 42, 52, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(206, 42, 52, 0.3)";
        }}
      >
        <MessageCircle size={20} className="text-[#ce2a34]" /> {/* Red Icon */}
        <span>Chat on WhatsApp</span>
      </a>

      <button
        onClick={(e) => {
          e.preventDefault();
          setIsVisible(false);
        }}
        style={{
          position: "absolute",
          top: "-10px",
          right: "-5px",
          background: "#ce2a34" /* Red Close Button */,
          border: "2px solid #1b1b1b",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          color: "white",
          zIndex: 9992,
        }}
      >
        <X size={14} />
      </button>

      <style>{`
        .whatsapp-float-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-family: sans-serif;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
