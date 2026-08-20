import React, { useState } from 'react';
import { createBooking } from '../services/api';
import { VEHICLE_PRESETS } from '../data/vehiclePresets';
import { X, Zap, CheckCircle2, AlertTriangle, Calendar, Clock, Car, ShieldCheck, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookingModal({ station, slot, selectedVehicle, onClose, onSuccess }) {
  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [vehicleType, setVehicleType] = useState(
    selectedVehicle && selectedVehicle.id !== 'all' ? selectedVehicle.name : 'Tata Nexon EV'
  );

  // Default duration based on connector type
  const defaultDuration = station?.connectorTypes?.includes('CCS2') ? 30 : 90;
  const [durationMinutes, setDurationMinutes] = useState(defaultDuration);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Please enter your name for the reservation.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        stationId: station.id,
        slotId: slot ? slot.id : null,
        customerName: customerName.trim(),
        vehicleType: vehicleType,
        bookingTime: new Date().toISOString(),
        durationMinutes: parseInt(durationMinutes, 10)
      };

      const result = await createBooking(payload);
      setConfirmedBooking(result);
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete slot reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyReferenceCode = () => {
    if (confirmedBooking?.bookingReferenceCode) {
      navigator.clipboard.writeText(confirmedBooking.bookingReferenceCode);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  if (!station) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141410]/70"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-[#F7F6F1] border-2 border-[#141410] rounded-none max-w-lg w-full p-4 sm:p-6 shadow-hard relative overflow-y-auto max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#141410] hover:text-[#6E6E64] p-1.5 rounded-none transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmedBooking ? (
          /* FORM VIEW */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#6E6E64] uppercase tracking-wider font-body">
                  {station.network}
                </span>
                <span className="text-xs text-[#6E6E64] font-medium font-body">{station.city}</span>
              </div>
              <h2 className="text-xl font-bold text-[#141410] font-display">{station.name}</h2>
              <p className="text-xs text-[#6E6E64] mt-0.5 truncate font-body">{station.address}</p>
            </div>

            {/* Selected Slot Highlight */}
            <div className="p-3 bg-[#F7F6F1] border-2 border-[#141410] rounded-none flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-none bg-white border border-[#141410] flex items-center justify-center text-[#141410] font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#141410] font-body">
                    {slot ? `Slot #${slot.slotNumber}` : 'Auto-Assign First Available Slot'}
                  </div>
                  <div className="text-[11px] text-[#6E6E64] font-body">
                    Tariff: <strong className="text-[#141410]">₹{station.pricePerKwh}/kWh</strong>
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#F7F6F1] bg-[#146B3A] px-2.5 py-1 rounded-none border border-[#141410]">
                Ready to Reserve
              </span>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="p-3 bg-white border-2 border-[#B23A2E] rounded-none text-xs text-[#141410] flex items-start gap-2 font-body">
                <AlertTriangle className="w-4 h-4 text-[#B23A2E] shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-[#141410] uppercase tracking-wider mb-1 font-body">
                Driver Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-[#F7F6F1] border-2 border-[#141410] rounded-none px-3.5 py-2.5 text-xs text-[#141410] placeholder-[#6E6E64] focus:outline-none focus:ring-2 focus:ring-[#146B3A] font-body"
                required
              />
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="block text-xs font-bold text-[#141410] uppercase tracking-wider mb-1 font-body">
                EV Model
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full bg-[#F7F6F1] border-2 border-[#141410] rounded-none px-3.5 py-2.5 text-xs text-[#141410] focus:outline-none focus:ring-2 focus:ring-[#146B3A] cursor-pointer font-body"
              >
                {VEHICLE_PRESETS.filter(v => v.id !== 'all').map(veh => (
                  <option key={veh.id} value={veh.name}>
                     {veh.name} ({veh.brand})
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Selection */}
            <div>
              <label className="block text-xs font-bold text-[#141410] uppercase tracking-wider mb-1 font-body">
                Planned Charging Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 45, 60, 90, 120].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDurationMinutes(dur)}
                    className={`py-2 px-3 rounded-none text-xs font-bold border-2 transition-all cursor-pointer font-body ${
                      durationMinutes === dur
                        ? 'bg-[#141410] text-[#F7F6F1] border-[#141410]'
                        : 'bg-[#F7F6F1] text-[#141410] border-[#141410] hover:bg-[#6E6E64]/10'
                    }`}
                  >
                    {dur} min
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                style={{ boxShadow: '4px 4px 0 0 #146B3A' }}
                className="w-full bg-[#141410] text-white font-bold font-body text-sm py-3.5 rounded-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 relative overflow-hidden"
              >
                {submitting ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Reserving Slot...</span>
                    <div className="absolute bottom-0 left-0 right-0 h-1 voltage-loading bg-[#146B3A]"></div>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Confirm Reservation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* CONFIRMATION VIEW */
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 rounded-none border-2 border-[#141410] bg-[#141410] text-white flex items-center justify-center mx-auto" style={{ boxShadow: '4px 4px 0 0 #146B3A' }}>
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#141410] mt-2 font-display uppercase tracking-wider">
                Reservation Confirmed
              </h3>
              <div className="h-2 voltage-stripe w-full max-w-[200px] mx-auto mt-2"></div>
              <p className="text-xs text-[#6E6E64] mt-3 font-body">
                Your charging slot has been reserved. Please show this reference code at the station.
              </p>
            </div>

            {/* Reference Code Card */}
            <div className="bg-[#F7F6F1] p-4 rounded-none border-2 border-dashed border-[#141410] space-y-2 mt-4">
              <div className="text-[10px] font-bold text-[#6E6E64] uppercase tracking-wider font-body">
                Booking Reference Code
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-[#141410] font-mono-data uppercase">
                  {confirmedBooking.bookingReferenceCode}
                </span>
                <button
                  type="button"
                  onClick={copyReferenceCode}
                  className="p-2 rounded-none bg-[#146B3A] text-white hover:bg-[#141410] transition-colors cursor-pointer flex-shrink-0"
                  title="Copy Reference Code"
                >
                  {copiedRef ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Summary Details Table */}
            <div className="text-xs bg-[#F7F6F1] border-2 border-[#141410] rounded-none divide-y-2 divide-[#141410] text-left font-body mt-4">
              <div className="flex justify-between p-2">
                <span className="text-[#6E6E64] font-bold">Station</span>
                <span className="font-bold text-[#141410]">{confirmedBooking.stationName}</span>
              </div>
              <div className="flex justify-between p-2">
                <span className="text-[#6E6E64] font-bold">Reserved Slot</span>
                <span className="font-bold text-[#146B3A]">Slot #{confirmedBooking.slotNumber}</span>
              </div>
              <div className="flex justify-between p-2">
                <span className="text-[#6E6E64] font-bold">Driver</span>
                <span className="font-bold text-[#141410]">{confirmedBooking.customerName} ({confirmedBooking.vehicleType})</span>
              </div>
              <div className="flex justify-between p-2">
                <span className="text-[#6E6E64] font-bold">Duration</span>
                <span className="font-bold text-[#141410]">{confirmedBooking.durationMinutes} minutes</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                style={{ boxShadow: '4px 4px 0 0 #141410' }}
                className="w-full bg-[#141410] text-white font-bold font-body text-sm py-3 rounded-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none cursor-pointer"
              >
                Done & Return to Map
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
