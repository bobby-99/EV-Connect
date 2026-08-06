import React from 'react';
import { VEHICLE_PRESETS } from '../data/vehiclePresets';
import { Car, Zap, Check, Bike } from 'lucide-react';

const VEHICLE_ICONS = {
  all: Zap,
  nexon: Car,
  mgzs: Car,
  tiago: Car,
  ola: Bike,
  ather: Bike,
  xuv400: Car
};

export default function VehicleSelector({ selectedVehicle, onSelectVehicle }) {
  return (
    <div className="border-b-2 border-[#141410] px-4 py-2.5" style={{ backgroundColor: '#F7F6F1' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-2 text-[#6E6E64] text-xs font-semibold uppercase tracking-wider shrink-0 font-display">
          <Car className="w-4 h-4 text-[#141410]" />
          <span>VEHICLE</span>
        </div>
        <div className="flex items-center shrink-0">
          {VEHICLE_PRESETS.map((preset) => {
            const isSelected = selectedVehicle.id === preset.id;
            const IconComponent = VEHICLE_ICONS[preset.id] || Car;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectVehicle(preset)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer border-2 font-body ${
                  isSelected
                    ? 'bg-[#141410] text-white border-[#141410] z-10'
                    : 'bg-[#F7F6F1] text-[#141410] border-[#141410] hover:bg-[#141410] hover:text-white -ml-0.5'
                }`}
                style={{ borderRadius: '0px' }}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{preset.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
