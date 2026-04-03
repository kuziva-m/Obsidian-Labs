import { CalendarAlert } from "lucide-react";

export default function AnnouncementBar() {
  const message =
    "HOLIDAY NOTICE - Please note that all orders placed between 23 April and 2 May will be processed and shipped on 3 May.";

  return (
    <div className="bg-[#ce2a34] text-white overflow-hidden py-2.5 relative flex items-center z-[100] border-b-2 border-[#1b1b1b]">
      {/* The scrolling container */}
      <div className="animate-marquee whitespace-nowrap flex items-center font-oswald tracking-widest text-xs md:text-sm uppercase">
        {/* Block 1 (Original) */}
        <div className="flex items-center min-w-full justify-around">
          <span className="mx-8 flex items-center gap-2">
            <CalendarAlert size={16} className="text-white/80" />
            <span className="font-bold text-white">{message}</span>
          </span>
          <span className="mx-8 flex items-center gap-2">
            <CalendarAlert size={16} className="text-white/80" />
            <span className="font-bold text-white">{message}</span>
          </span>
        </div>

        {/* Block 2 (Duplicate for seamless infinite looping) */}
        <div className="flex items-center min-w-full justify-around">
          <span className="mx-8 flex items-center gap-2">
            <CalendarAlert size={16} className="text-white/80" />
            <span className="font-bold text-white">{message}</span>
          </span>
          <span className="mx-8 flex items-center gap-2">
            <CalendarAlert size={16} className="text-white/80" />
            <span className="font-bold text-white">{message}</span>
          </span>
        </div>
      </div>

      {/* Embedded CSS for the flawless infinite marquee scroll */}
      <style>{`
        .animate-marquee {
          display: flex;
          width: max-content;
          /* 30s controls the speed. Lower = faster, Higher = slower */
          animation: scroll 30s linear infinite; 
        }
        
        /* Pause the scrolling if the user puts their mouse over it to read */
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes scroll {
          to {
            /* Translate by exactly 50% to seamlessly loop the two identical blocks */
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
