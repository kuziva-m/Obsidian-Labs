import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f5] px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
            <AlertTriangle size={48} className="text-[#ce2a34]" />
          </div>
        </div>

        <h1 className="font-[Oswald] text-9xl font-bold text-[#1b1b1b] leading-none mb-2">
          404
        </h1>
        <h2 className="font-[Oswald] text-2xl uppercase text-gray-500 tracking-widest mb-8">
          Page Not Found
        </h2>

        <p className="font-mono text-gray-500 max-w-md mx-auto mb-10">
          The coordinates you entered seem to be off the grid. This page has
          been moved, deleted, or never existed.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#1b1b1b] text-white px-8 py-4 rounded font-[Oswald] uppercase tracking-widest hover:bg-[#ce2a34] transition-all duration-300"
        >
          <ArrowLeft size={18} /> Return to Base
        </Link>
      </div>
    </div>
  );
}
