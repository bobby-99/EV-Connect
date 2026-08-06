import React from 'react';
import { Zap, MapPin, CheckCircle2, AlertTriangle, XCircle, Navigation, ShieldCheck, AlertOctagon } from 'lucide-react';

export default function StationCard({
  station,
  isSelected,
  isHero,
  selectedVehicle,
  onSelectStation
}) {
  const isCompatible = selectedVehicle.id === 'all' || 
    station.connectorTypes.some(c => selectedVehicle.connectors.includes(c));

  let statusColor = '#146B3A';
  let statusBg = '#146B3A';
  let statusText = `${station.availableSlots}/${station.totalSlots} AVAILABLE`;
  let StatusIcon = CheckCircle2;

  if (station.status === 'busy') {
    statusColor = '#D98E04';
    statusBg = '#D98E04';
    statusText = `0/${station.totalSlots} BUSY`;
    StatusIcon = AlertTriangle;
  } else if (station.status === 'full') {
    statusColor = '#B23A2E';
    statusBg = '#B23A2E';
    statusText = `FULL (${station.totalSlots})`;
    StatusIcon = XCircle;
  }

  return (
    <div
      onClick={() => onSelectStation(station)}
      className={`px-4 py-3 border-b border-[#6E6E64]/30 cursor-pointer transition-colors relative ${
        isHero
          ? 'bg-[#146B3A]/5 border-l-4 border-l-[#146B3A]'
          : isSelected
          ? 'bg-[#141410]/5 border-l-4 border-l-[#141410]'
          : 'hover:bg-[#141410]/3'
      } ${!isCompatible ? 'opacity-50' : ''}`}
    >
      {isHero && (
        <div
          className="absolute top-0 right-0 bg-[#146B3A] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider flex items-center gap-1 font-display"
          style={{ borderRadius: '0px' }}
        >
          <Zap className="w-3 h-3" />
          NEAREST
        </div>
      )}

      {/* Row 1: Network + Status */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[10px] font-bold text-[#6E6E64] uppercase tracking-[0.15em] font-display">
          {station.network}
        </span>
        <div
          className="flex items-center gap-1 text-[11px] font-bold text-white px-2 py-0.5 font-mono-data"
          style={{ backgroundColor: statusBg, borderRadius: '0px' }}
        >
          <StatusIcon className="w-3 h-3" />
          <span>{statusText}</span>
        </div>
      </div>

      {/* Row 2: Name */}
      <h3 className="font-bold text-[#141410] text-sm mb-0.5 font-body">
        {station.name}
      </h3>

      {/* Row 3: Address */}
      <div className="flex items-center gap-1 text-xs text-[#6E6E64] mb-2 font-body">
        <MapPin className="w-3 h-3 shrink-0" />
        <span className="truncate">{station.address}</span>
      </div>

      {/* Row 4: Connectors + Price */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#6E6E64]/20">
        <div className="flex flex-wrap gap-1">
          {station.connectorTypes.map(c => (
            <span
              key={c}
              className={`text-[10px] font-semibold px-2 py-0.5 border font-mono-data ${
                selectedVehicle.connectors.includes(c)
                  ? 'bg-[#146B3A] text-white border-[#141410]'
                  : 'bg-[#F7F6F1] text-[#141410] border-[#6E6E64]/40'
              }`}
              style={{ borderRadius: '0px' }}
            >
              {c}
            </span>
          ))}
        </div>

        <div className="flex items-baseline gap-1 text-right font-mono-data">
          <span className="text-base font-bold text-[#146B3A]">₹{station.pricePerKwh}</span>
          <span className="text-[10px] text-[#6E6E64] font-body">/kWh</span>
        </div>
      </div>

      {/* Score / Distance */}
      {station.distanceKm !== undefined && station.distanceKm !== null && (
        <div className="mt-2 pt-2 border-t border-[#6E6E64]/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-[#141410] font-bold font-mono-data">
            <Navigation className="w-3 h-3" />
            <span>{station.distanceKm} km</span>
          </div>
          {station.scoreExplanation && (
            <span className="text-[10px] text-[#6E6E64] italic truncate max-w-[200px] font-body" title={station.scoreExplanation}>
              {station.scoreExplanation}
            </span>
          )}
        </div>
      )}

      {/* Compatibility */}
      {selectedVehicle.id !== 'all' && (
        <div className="mt-2 flex items-center gap-1 text-[11px]">
          {isCompatible ? (
            <span className="text-[#146B3A] flex items-center gap-1 font-semibold font-body">
              <ShieldCheck className="w-3.5 h-3.5" /> Compatible with {selectedVehicle.name}
            </span>
          ) : (
            <span className="text-[#B23A2E] flex items-center gap-1 font-semibold font-body">
              <AlertOctagon className="w-3.5 h-3.5" /> Incompatible connectors for {selectedVehicle.name}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
