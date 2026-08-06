import React from 'react';
import { Zap, Navigation, CheckCircle2, Loader } from 'lucide-react';

export default function HeroNearestButton({ onFindNearest, isLoading, heroResult }) {
  return (
    <div className="border-2 border-[#141410] p-4 relative" style={{ backgroundColor: '#F7F6F1', borderRadius: '0px' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#146B3A]" style={{ display: 'inline-block' }}></span>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#146B3A] font-display">
              SMART AVAILABILITY ENGINE
            </span>
          </div>
          <h2 className="text-lg font-black text-[#141410] font-display uppercase tracking-wide">
            Don't just find nearby — find <span className="text-[#146B3A] underline decoration-[#146B3A] underline-offset-2 decoration-2">AVAILABLE</span>
          </h2>
          <p className="text-xs text-[#6E6E64] font-body">
            Ranks stations using distance + real-time slot occupancy algorithm.
          </p>
        </div>

        <button
          onClick={onFindNearest}
          disabled={isLoading}
          className="w-full sm:w-auto shrink-0 bg-[#141410] text-white font-bold text-sm px-6 py-3.5 shadow-hard-green cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 font-display uppercase tracking-wider active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
          style={{ borderRadius: '0px', boxShadow: isLoading ? 'none' : '3px 3px 0 #146B3A' }}
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>SCORING...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>FIND NEAREST AVAILABLE</span>
            </>
          )}
        </button>
      </div>

      {heroResult && (
        <div className="mt-4 pt-3 border-t-2 border-[#141410] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs p-3 border-2 border-[#146B3A]" style={{ borderRadius: '0px', backgroundColor: '#F7F6F1' }}>
          <div className="flex items-center gap-2 text-[#141410] font-semibold font-body">
            <CheckCircle2 className="w-4 h-4 text-[#146B3A] shrink-0" />
            <span>Top Match: <strong>{heroResult.name}</strong></span>
          </div>
          <div className="flex items-center gap-3 font-mono-data font-bold">
            <span className="bg-[#146B3A] text-white px-2 py-0.5 text-[11px]" style={{ borderRadius: '0px' }}>
              {heroResult.availableSlots} / {heroResult.totalSlots} FREE
            </span>
            <span className="text-[#141410] flex items-center gap-1">
              <Navigation className="w-3 h-3" /> {heroResult.distanceKm} km
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
