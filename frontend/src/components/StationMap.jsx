import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function StationMap({
  stations,
  selectedStation,
  onSelectStation,
  heroStationId,
  userLocation = { lat: 12.9716, lng: 77.5946 },
  tripPlan = null
}) {
  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);
  const tripMarkersRef = useRef([]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapInstance.current) {
      const map = L.map(mapRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 12,
        zoomControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `
          <div style="background:#141410;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border:2px solid #F7F6F1;">
            <svg xmlns="http://www.w3.org/2000/svg" style="width:14px;height:14px;fill:#fff;margin:auto;" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindTooltip('Your Location (Bangalore Center)', { permanent: false, direction: 'top' });

      leafletMapInstance.current = map;
    }
  }, []);

  // Update map markers when stations or heroStationId change
  useEffect(() => {
    const map = leafletMapInstance.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    stations.forEach(station => {
      const isSelected = selectedStation && selectedStation.id === station.id;
      const isHero = heroStationId === station.id;

      let bgColor = '#146B3A'; // Transit Green
      if (station.status === 'busy') bgColor = '#D98E04'; // Hazard Amber
      else if (station.status === 'full') bgColor = '#B23A2E'; // Rust Red

      const extraClass = isHero ? 'hero-pin-highlight' : isSelected ? 'scale-125 z-[999]' : 'hover:scale-110';

      const customIcon = L.divIcon({
        className: 'custom-station-pin',
        html: `
          <div class="cursor-pointer transition-all duration-300 ${extraClass}" style="display:flex;flex-direction:column;align-items:center">
             <div style="background:${bgColor};color:#fff;border:2px solid #141410;padding:2px 6px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:700;display:flex;align-items:center;gap:3px">
               <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
               ${station.availableSlots}/${station.totalSlots}
             </div>
             <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid ${bgColor}"></div>
           </div>
        `,
        iconSize: [60, 40],
        iconAnchor: [30, 40]
      });

      const marker = L.marker([station.latitude, station.longitude], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          onSelectStation(station);
          map.flyTo([station.latitude, station.longitude], 14, { duration: 1.2 });
        });

      marker.bindPopup(`
        <div style="background-color:#F7F6F1;color:#141410;border:2px solid #141410;padding:8px;min-width:200px;font-family:'IBM Plex Sans',sans-serif;">
          <div style="font-size:10px;font-weight:700;color:#6E6E64;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">${station.network}</div>
          <div style="font-size:14px;font-weight:700;color:#141410;margin-bottom:4px;">${station.name}</div>
          <div style="font-size:12px;color:#6E6E64;margin-bottom:8px;">${station.address}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid #141410;padding-top:8px;">
            <span style="font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:700;color:#146B3A;">₹${station.pricePerKwh}/kWh</span>
            <span style="font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:700;color:#141410;">${station.availableSlots}/${station.totalSlots} Slots Free</span>
          </div>
        </div>
      `, {
        className: 'custom-popup-hard',
        closeButton: false
      });

      markersRef.current[station.id] = marker;
    });
  }, [stations, selectedStation, heroStationId]);

  // Render Trip Planner Polyline and Special Stop Pins
  useEffect(() => {
    const map = leafletMapInstance.current;
    if (!map) return;

    // Clear previous trip polyline & markers
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }
    tripMarkersRef.current.forEach(m => m.remove());
    tripMarkersRef.current = [];

    if (tripPlan && tripPlan.routeCoordinates && tripPlan.routeCoordinates.length > 0) {
      const polyline = L.polyline(tripPlan.routeCoordinates, {
        color: '#146B3A',
        weight: 4,
        opacity: 1
      }).addTo(map);

      polylineRef.current = polyline;

      // Start Marker
      const startIcon = L.divIcon({
        className: 'trip-start-pin',
        html: `
          <div style="background:#146B3A;color:#fff;border:2px solid #141410;padding:4px 8px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:700;white-space:nowrap;">
            START: ${tripPlan.startName || 'Origin'}
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [60, 15]
      });

      const startMarker = L.marker([tripPlan.startLat, tripPlan.startLng], { icon: startIcon }).addTo(map);
      tripMarkersRef.current.push(startMarker);

      // Destination Marker
      const destIcon = L.divIcon({
        className: 'trip-dest-pin',
        html: `
          <div style="background:#B23A2E;color:#fff;border:2px solid #141410;padding:4px 8px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:700;white-space:nowrap;">
            END: ${tripPlan.destName || 'Destination'}
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [60, 15]
      });

      const destMarker = L.marker([tripPlan.destLat, tripPlan.destLng], { icon: destIcon }).addTo(map);
      tripMarkersRef.current.push(destMarker);

      // Suggested Charging Stop Pins
      if (tripPlan.suggestedStops) {
        tripPlan.suggestedStops.forEach(stop => {
          const stopIcon = L.divIcon({
            className: 'trip-stop-pin',
            html: `
              <div style="display:flex;flex-direction:column;align-items:center;z-index:1000">
                <div style="background:#141410;color:#146B3A;border:2px solid #141410;padding:4px 8px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:700;white-space:nowrap;">
                  SUGGESTED STOP
                </div>
                <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #141410"></div>
              </div>
            `,
            iconSize: [140, 35],
            iconAnchor: [70, 35]
          });

          const stopMarker = L.marker([stop.latitude, stop.longitude], { icon: stopIcon })
            .addTo(map)
            .bindPopup(`
              <div style="background-color:#F7F6F1;color:#141410;border:2px solid #141410;padding:8px;min-width:200px;font-family:'IBM Plex Sans',sans-serif;">
                <div style="font-size:10px;font-weight:700;color:#6E6E64;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">RECOMMENDED STOP</div>
                <div style="font-size:14px;font-weight:700;color:#141410;margin-bottom:4px;">${stop.name}</div>
                <div style="font-size:12px;color:#6E6E64;margin-bottom:8px;">${stop.address}</div>
                <div style="border-top:1px solid #141410;padding-top:8px;">
                  <span style="font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:700;color:#146B3A;">Tariff: ₹${stop.pricePerKwh}/kWh</span>
                </div>
              </div>
            `, {
              className: 'custom-popup-hard',
              closeButton: false
            });

          tripMarkersRef.current.push(stopMarker);
        });
      }

      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
  }, [tripPlan]);

  useEffect(() => {
    if (selectedStation && leafletMapInstance.current) {
      leafletMapInstance.current.flyTo(
        [selectedStation.latitude, selectedStation.longitude],
        15,
        { duration: 1.2 }
      );
      if (markersRef.current[selectedStation.id]) {
        markersRef.current[selectedStation.id].openPopup();
      }
    }
  }, [selectedStation]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-popup-hard .leaflet-popup-content-wrapper {
        background: none;
        box-shadow: none;
        border-radius: 0;
        padding: 0;
      }
      .custom-popup-hard .leaflet-popup-content {
        margin: 0;
        width: auto !important;
      }
      .custom-popup-hard .leaflet-popup-tip-container {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] overflow-hidden border-2 border-[#141410] bg-[#F7F6F1]">
      <div ref={mapRef} className="w-full h-full z-10" />

      {/* Map Legend Overlay */}
      <div className="absolute top-4 right-4 z-20 bg-[#F7F6F1] border-2 border-[#141410] p-2 shadow-hard-sm flex flex-col gap-2 font-['IBM_Plex_Sans',sans-serif]">
        <div className="text-[10px] font-bold uppercase text-[#6E6E64]">Station Status</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#146B3A]"></span>
          <span className="text-[#141410] text-xs font-medium">Available (&gt;0 Slots)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#D98E04]"></span>
          <span className="text-[#141410] text-xs font-medium">Busy / In Use</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#B23A2E]"></span>
          <span className="text-[#141410] text-xs font-medium">Full</span>
        </div>
        {tripPlan && (
          <div className="flex items-center gap-2 pt-2 border-t border-[#141410]">
            <span className="w-3 h-3 bg-[#141410]"></span>
            <span className="text-[#141410] text-xs font-bold">Suggested Stop</span>
          </div>
        )}
      </div>
    </div>
  );
}
