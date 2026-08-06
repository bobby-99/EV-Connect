import React, { useEffect, useState } from 'react';
import { fetchStationDetail, fetchWaitTimePrediction, fetchStationHeatmap } from '../services/api';
import PeakHourChart from './PeakHourChart';
import BookingModal from './BookingModal';
import { X, Zap, MapPin, Clock, ShieldCheck, RefreshCw, AlertTriangle, CheckCircle2, BookmarkPlus } from 'lucide-react';

import { motion } from 'framer-motion';

export default function StationDetail({ stationId, onClose, selectedVehicle, onBookingSuccess }) {
  const [detail, setDetail] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);

  // Booking modal state
  const [bookingSlot, setBookingSlot] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const loadAllData = async () => {
    if (!stationId) return;
    setLoading(true);
    setChartLoading(true);

    try {
      const [detailRes, predRes, heatmapRes] = await Promise.all([
        fetchStationDetail(stationId),
        fetchWaitTimePrediction(stationId),
        fetchStationHeatmap(stationId)
      ]);

      setDetail(detailRes);
      setPrediction(predRes);
      setHeatmapData(heatmapRes);
    } catch (err) {
      console.error('Failed to load station detail & prediction', err);
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [stationId]);

  const handleOpenBooking = (slot = null) => {
    setBookingSlot(slot);
    setIsBookingModalOpen(true);
  };

  const handleBookingComplete = (bookingResult) => {
    loadAllData();
    if (onBookingSuccess) {
      onBookingSuccess(bookingResult);
    }
  };

  if (!stationId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="bg-[#F7F6F1] border-2 border-[#141410] p-5 relative overflow-hidden space-y-4 font-body text-[#141410]"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-[#141410] text-[#F7F6F1] p-1 border-2 border-[#141410] hover:bg-[#F7F6F1] hover:text-[#141410] transition-colors z-10 shadow-hard active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
      >
        <X className="w-5 h-5" />
      </button>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-[#141410] gap-4">
          <div className="voltage-loading w-full max-w-[200px] h-2 border-2 border-[#141410] bg-white"></div>
          <span className="text-xs font-display font-bold uppercase tracking-wider">Loading station telemetry & predictions...</span>
        </div>
      ) : detail ? (
        <>
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1 pr-8">
              <span className="text-xs font-display text-[#6E6E64] font-bold uppercase tracking-wider">
                {detail.network}
              </span>
              <span className="text-xs text-[#6E6E64] font-medium font-body">{detail.city}</span>
            </div>
            <h2 className="text-xl font-bold font-display text-[#141410]">{detail.name}</h2>
            <p className="text-xs text-[#6E6E64] flex items-center gap-1 mt-1 font-body">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{detail.address}</span>
            </p>
          </div>

          {/* Primary Action Button */}
          {detail.availableSlots > 0 && (
            <button
              onClick={() => handleOpenBooking(null)}
              className="w-full bg-[#146B3A] text-white font-display font-bold text-sm px-4 py-3 border-2 border-[#141410] shadow-hard active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Reserve Slot at this Station</span>
            </button>
          )}

          {/* Wait-Time Prediction Card */}
          {prediction && (
            <div
              className={`p-3.5 border-2 border-[#141410] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                prediction.isAvailableNow
                  ? 'bg-[#146B3A] text-white'
                  : 'bg-[#D98E04] text-[#141410]'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-xs font-display">
                  {prediction.isAvailableNow ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 shrink-0" />
                  )}
                  <span className="uppercase tracking-wider">
                    {prediction.isAvailableNow ? 'No Wait Required' : 'Predicted Queue Wait Time'}
                  </span>
                </div>
                <p className="text-xs leading-snug font-body opacity-90">{prediction.explanation}</p>
              </div>

              {!prediction.isAvailableNow && (
                <div className="shrink-0 bg-[#F7F6F1] border-2 border-[#141410] text-[#141410] font-bold px-3 py-1.5 text-sm shadow-hard flex items-center gap-1 font-mono-data">
                  <span>~{prediction.predictedWaitMinutes} min</span>
                </div>
              )}
            </div>
          )}

          {/* Tariff & Live Capacity */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-white border-2 border-[#141410]">
            <div>
              <span className="text-[11px] font-bold text-[#6E6E64] font-display uppercase tracking-wider">Tariff</span>
              <div className="text-lg font-bold text-[#141410] font-mono-data">
                ₹{detail.pricePerKwh} <span className="text-xs font-normal text-[#6E6E64] font-body">/ kWh</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#6E6E64] font-display uppercase tracking-wider">Live Capacity</span>
              <div className="text-lg font-bold text-[#141410] font-mono-data">
                <span className="text-[#146B3A]">{detail.availableSlots}</span> / {detail.totalSlots} <span className="text-xs font-normal text-[#6E6E64] font-body">Free</span>
              </div>
            </div>
          </div>

          {/* Peak-Hour Occupancy Chart */}
          <PeakHourChart data={heatmapData} loading={chartLoading} />

          {/* Supported Connectors */}
          <div>
            <h4 className="text-xs font-bold text-[#141410] font-display uppercase tracking-wider mb-2">Supported Connectors</h4>
            <div className="flex flex-wrap gap-2">
              {detail.connectorTypes?.map((connector) => {
                const isMatch = selectedVehicle && selectedVehicle.connectors?.includes(connector);
                return (
                  <div
                    key={connector}
                    className={`px-3 py-1 text-xs font-bold font-display flex items-center gap-1.5 border-2 border-[#141410] shadow-hard ${
                      isMatch
                        ? 'bg-[#146B3A] text-white'
                        : 'bg-white text-[#141410]'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    <span>{connector}</span>
                    {isMatch && <ShieldCheck className="w-3.5 h-3.5" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Slot List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-[#141410] font-display uppercase tracking-wider">Live Slot Status</h4>
              <button
                onClick={loadAllData}
                className="text-[11px] text-[#141410] hover:underline flex items-center gap-1 cursor-pointer font-display font-bold uppercase tracking-wider"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {detail.slots?.map((slot) => {
                const isAvail = slot.status?.toLowerCase() === 'available';
                const isReserved = slot.status?.toLowerCase() === 'reserved';
                const isBusy = slot.status?.toLowerCase() === 'busy';

                const statusBg = isAvail ? 'bg-[#146B3A]' : isReserved ? 'bg-[#B23A2E]' : isBusy ? 'bg-[#D98E04]' : 'bg-[#B23A2E]';
                const statusText = isAvail ? 'text-[#146B3A]' : isReserved ? 'text-[#B23A2E]' : isBusy ? 'text-[#D98E04]' : 'text-[#B23A2E]';
                const statusLabel = isAvail ? 'Available' : isReserved ? 'Reserved' : isBusy ? 'Busy' : 'Occupied';

                return (
                  <div
                    key={slot.id}
                    className="p-3 bg-white border-2 border-[#141410] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 border border-[#141410] ${statusBg}`}></div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold font-display text-[#141410]">
                          Slot <span className="font-mono-data">#{slot.slotNumber}</span>
                        </span>
                        <span className={`text-[11px] font-bold uppercase font-display tracking-wider ${statusText}`}>
                          {statusLabel}
                        </span>
                      </div>
                    </div>

                    {isAvail && (
                      <button
                        onClick={() => handleOpenBooking(slot)}
                        className="bg-[#146B3A] text-white border-2 border-[#141410] shadow-hard active:shadow-none active:translate-x-[3px] active:translate-y-[3px] text-xs font-bold font-display px-3 py-1.5 transition-all cursor-pointer"
                      >
                        Book Slot
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : null}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal
          station={detail}
          slot={bookingSlot}
          selectedVehicle={selectedVehicle}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={handleBookingComplete}
        />
      )}
    </motion.div>
  );
}
