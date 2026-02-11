import { useEffect, useRef } from "react";

// --- KINETIC TEXT COMPONENT ---
export function KineticText({ children, className = "", delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("active"), delay);
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div className="overflow-hidden">
      <span ref={ref} className={`kinetic-text block ${className}`}>
        {children}
      </span>
    </div>
  );
}

// --- CURTAIN REVEAL COMPONENT ---
export function CurtainReveal({ src, alt, className = "" }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

// --- ADD THIS DEFAULT EXPORT TO FIX THE BUILD ERROR ---
export default function Animations() {
  return null; // This file is a utility library, not a page component.
}
