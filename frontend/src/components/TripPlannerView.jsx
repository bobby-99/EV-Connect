import React, { useState } from 'react';
import { planTrip } from '../services/api';
import { VEHICLE_PRESETS } from '../data/vehiclePresets';
import { MapPin, Navigation, Zap, Clock, AlertCircle, ArrowRight, Loader, BookmarkPlus, Car, Bike } from 'lucide-react';

const VEHICLE_ICONS = {
  all: Zap,
  nexon: Car,
  mgzs: Car,
  tiago: Car,
  ola: Bike,
  ather: Bike,
  xuv400: Car
};

export default function TripPlannerView({
  selectedVehicle,
  onSelectVehicle,
  onTripPlanned,
  onSelectStationForBooking
}) {
  const [startLocation, setStartLocation] = useState('Koramangala, Bangalore');
  const [destLocation, setDestLocation] = useState('Electronic City, Bangalore');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [tripResult, setTripResult] = useState(null);

  const presetLandmarks = [
    'Koramangala',
    'Indiranagar',
    'Whitefield',
    'Electronic City',
    'Hebbal',
    'HSR Layout',
    'Mysore Highway'
  ];

  const handlePlanTrip = async (e) => {
    if (e) e.preventDefault();
    if (!startLocation.trim() || !destLocation.trim()) {
      setErrorMsg('Enter both start and destination locations.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        startLocation: startLocation.trim(),
        destLocation: destLocation.trim(),
        vehicleType: selectedVehicle.id !== 'all' ? selectedVehicle.name : 'Ather 450X'
      };

      const data = await planTrip(payload);
      setTripResult(data);
      if (onTripPlanned) {
        onTripPlanned(data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to calculate EV trip route.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-[#141410] p-5 shadow-hard" style={{ backgroundColor: '#F7F6F1', borderRadius: '0px' }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[#141410] pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#146B3A] flex items-center justify-center text-white" style={{ borderRadius: '0px' }}>
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#141410] font-display uppercase tracking-wider">EV ROUTE PLANNER</h2>
            <p className="text-[11px] text-[#6E6E64] font-body">Battery range evaluation & charging stop planning</p>
          </div>
        </div>
        <span className="bg-[#141410] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider font-display" style={{ borderRadius: '0px' }}>
          OSRM
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handlePlanTrip} className="space-y-3">
        {/* Start */}
        <div>
          <label className="block text-[10px] font-bold text-[#141410] uppercase tracking-[0.15em] mb-1 flex items-center gap-1 font-display">
            <MapPin className="w-3 h-3 text-[#146B3A]" /> ORIGIN
          </label>
          <input
            type="text"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            placeholder="e.g. Koramangala, Bangalore"
            className="w-full bg-[#F7F6F1] border-2 border-[#141410] px-3 py-2 text-xs text-[#141410] placeholder-[#6E6E64] focus:outline-none focus:border-[#146B3A] font-body"
            style={{ borderRadius: '0px' }}
            required
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-[10px] font-bold text-[#141410] uppercase tracking-[0.15em] mb-1 flex items-center gap-1 font-display">
            <MapPin className="w-3 h-3 text-[#B23A2E]" /> DESTINATION
          </label>
          <input
            type="text"
            value={destLocation}
            onChange={(e) => setDestLocation(e.target.value)}
            placeholder="e.g. Electronic City, Bangalore"
            className="w-full bg-[#F7F6F1] border-2 border-[#141410] px-3 py-2 text-xs text-[#141410] placeholder-[#6E6E64] focus:outline-none focus:border-[#146B3A] font-body"
            style={{ borderRadius: '0px' }}
            required
          />
        </div>

        {/* Preset chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-[11px]">
          <span className="shrink-0 font-bold text-[#6E6E64] font-display text-[10px] uppercase tracking-wider">PRESETS:</span>
          {presetLandmarks.map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => setDestLocation(preset + ', Bangalore')}
              className="border border-[#141410] text-[#141410] px-2 py-0.5 shrink-0 hover:bg-[#141410] hover:text-white transition-colors cursor-pointer text-[11px] font-body"
              style={{ borderRadius: '0px' }}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Vehicle */}
        <div>
          <label className="block text-[10px] font-bold text-[#141410] uppercase tracking-[0.15em] mb-1 flex items-center gap-1 font-display">
            <Zap className="w-3 h-3 text-[#D98E04]" /> VEHICLE & RANGE
          </label>
          <select
            value={selectedVehicle.id}
            onChange={(e) => {
              const veh = VEHICLE_PRESETS.find(v => v.id === e.target.value);
              if (veh) onSelectVehicle(veh);
            }}
            className="w-full bg-[#F7F6F1] border-2 border-[#141410] px-3 py-2 text-xs text-[#141410] focus:outline-none focus:border-[#146B3A] cursor-pointer font-body"
            style={{ borderRadius: '0px' }}
          >
            {VEHICLE_PRESETS.filter(v => v.id !== 'all').map(veh => (
              <option key={veh.id} value={veh.id}>
                {veh.name} — {veh.batteryKwh} kWh
              </option>
            ))}
          </select>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#B23A2E]/10 border-2 border-[#B23A2E] text-xs text-[#141410] flex items-center gap-2 font-body" style={{ borderRadius: '0px' }}>
            <AlertCircle className="w-4 h-4 text-[#B23A2E] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#141410] text-white font-black text-xs py-3 shadow-hard-green flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-display uppercase tracking-wider active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
          style={{ borderRadius: '0px', boxShadow: loading ? 'none' : '3px 3px 0 #146B3A' }}
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>CALCULATING ROUTE...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              <span>PLAN EV ROUTE</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {loading && <div className="h-2 voltage-loading" style={{ borderRadius: '0px' }}></div>}
      </form>

      {/* Result */}
      {tripResult && (
        <div className="space-y-3 pt-4 mt-4 border-t-2 border-[#141410]">
          {/* Summary */}
          <div
            className={`p-3 border-2 flex flex-col gap-1 ${
              tripResult.isStopRequired
                ? 'border-[#D98E04] bg-[#D98E04]/5'
                : 'border-[#146B3A] bg-[#146B3A]/5'
            }`}
            style={{ borderRadius: '0px' }}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-display text-[#141410]">
              <Zap className="w-4 h-4 shrink-0" />
              <span>{tripResult.summaryMessage}</span>
            </div>
            {tripResult.isIllustrative && (
              <p className="text-[11px] text-[#6E6E64] italic font-body">
                * Illustrative stop shown for route outside Bangalore.
              </p>
            )}
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 border-2 border-[#141410]" style={{ borderRadius: '0px' }}>
            <div className="text-center p-3 border-r border-[#6E6E64]/30">
              <div className="text-[10px] text-[#6E6E64] uppercase font-bold font-display tracking-wider">DISTANCE</div>
              <div className="text-lg font-bold text-[#141410] font-mono-data">{tripResult.totalDistanceKm} km</div>
            </div>
            <div className="text-center p-3 border-r border-[#6E6E64]/30">
              <div className="text-[10px] text-[#6E6E64] uppercase font-bold font-display tracking-wider">DRIVE TIME</div>
              <div className="text-lg font-bold text-[#141410] font-mono-data">{tripResult.estimatedDurationMinutes} min</div>
            </div>
            <div className="text-center p-3">
              <div className="text-[10px] text-[#6E6E64] uppercase font-bold font-display tracking-wider">RANGE</div>
              <div className="text-lg font-bold text-[#146B3A] font-mono-data">{tripResult.vehicleRangeKm} km</div>
            </div>
          </div>

          {/* Stops */}
          {tripResult.suggestedStops && tripResult.suggestedStops.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-[#141410] uppercase tracking-[0.15em] font-display">
                RECOMMENDED CHARGING STOP
              </div>

              {tripResult.suggestedStops.map((stop, idx) => (
                <div
                  key={idx}
                  className="p-3 border-2 border-[#141410] space-y-2"
                  style={{ backgroundColor: '#F7F6F1', borderRadius: '0px' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E64] font-display">
                      {stop.network}
                    </span>
                    <span className="text-xs font-bold text-[#141410] font-mono-data">
                      ~{stop.distanceFromStartKm} km from start
                    </span>
                  </div>

                  <h4 className="font-bold text-[#141410] text-sm font-body">{stop.name}</h4>
                  <p className="text-xs text-[#6E6E64] font-body">{stop.address}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#6E6E64]/30 text-xs">
                    <div className="flex gap-1">
                      {stop.connectorTypes?.map(c => (
                        <span key={c} className="text-[10px] border border-[#141410] text-[#141410] px-1.5 py-0.5 font-mono-data" style={{ borderRadius: '0px' }}>
                          {c}
                        </span>
                      ))}
                    </div>
                    <span className="font-bold text-[#146B3A] font-mono-data">₹{stop.pricePerKwh}/kWh</span>
                  </div>

                  {stop.stationId > 0 && onSelectStationForBooking && (
                    <button
                      onClick={() => onSelectStationForBooking(stop.stationId)}
                      className="w-full mt-1 bg-[#146B3A] text-white text-xs font-bold py-1.5 flex items-center justify-center gap-1.5 cursor-pointer font-display uppercase tracking-wider active:translate-y-[2px] transition-all"
                      style={{ borderRadius: '0px' }}
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" /> RESERVE SLOT
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
