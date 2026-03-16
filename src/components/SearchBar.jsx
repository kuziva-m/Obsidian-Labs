import { Search, X } from "lucide-react";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  placeholder = "SEARCH COMPOUNDS, PEPTIDES, OR BLENDS...",
}) {
  return (
    <div className="relative w-full max-w-2xl mx-auto group z-10">
      {/* Decorative Top Accent Line */}
      <div className="absolute -top-[2px] left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#ce2a34] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 z-20"></div>

      <div className="relative flex items-center w-full bg-white border-2 border-gray-200 focus-within:border-[#1b1b1b] focus-within:shadow-[6px_6px_0px_0px_#ce2a34] focus-within:-translate-y-[2px] transition-all duration-300 rounded-sm overflow-hidden">
        {/* Search Icon */}
        <div className="pl-5 pr-2 text-gray-400 group-focus-within:text-[#ce2a34] transition-colors">
          <Search size={20} strokeWidth={2.5} />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full py-4 pl-2 pr-12 font-oswald tracking-wide text-sm md:text-base text-[#1b1b1b] bg-transparent outline-none placeholder:text-gray-400 placeholder:font-oswald uppercase"
        />

        {/* Clear Button (Only shows when there is text) */}
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-4 p-1.5 text-gray-400 hover:text-white hover:bg-[#ce2a34] rounded-sm transition-all bg-white shadow-sm border border-gray-100"
            aria-label="Clear search"
          >
            <X size={16} strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
}
