import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchStations, fetchNearestAvailable, fetchStationDetail } from './services/api';
import { VEHICLE_PRESETS } from './data/vehiclePresets';
import LandingPage from './components/LandingPage';
import VehicleSelector from './components/VehicleSelector';
import StationMap from './components/StationMap';
import StationCard from './components/StationCard';
import StationDetail from './components/StationDetail';
import HeroNearestButton from './components/HeroNearestButton';
import TripPlannerView from './components/TripPlannerView';
import { Zap, Search, RefreshCw, Navigation, Map, Loader2 } from 'lucide-react';

export default function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [activeTab, setActiveTab] = useState('finder');
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_PRESETS[0]);
  const [heroStation, setHeroStation] = useState(null);
  const [tripPlan, setTripPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [slowServerNotice, setSlowServerNotice] = useState(false);

  const detailAnchorRef = useRef(null);

  const loadStations = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    
    // Slow server notice timer for Render free tier cold starts
    const timer = setTimeout(() => {
      if (!isSilent && loading) {
        setSlowServerNotice(true);
      }
    }, 4000);

    try {
      const data = await fetchStations();
      setStations(data);
      setSlowServerNotice(false);
    } catch (err) {
      console.error('Failed to load stations', err);
    } finally {
      clearTimeout(timer);
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    loadStations();
    const interval = setInterval(() => {
      loadStations(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectStation = (station) => {
    setSelectedStation(station);
    // Smooth scroll to station detail on mobile if station is selected
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        detailAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleFindNearest = async () => {
    setHeroLoading(true);
    try {
      const ranked = await fetchNearestAvailable(12.9716, 77.5946, 25);
      if (ranked && ranked.length > 0) {
        const topMatch = ranked[0];
        setStations(ranked);
        setHeroStation(topMatch);
        handleSelectStation(topMatch);
      }
    } catch (err) {
      console.error('Failed scoring lookup', err);
    } finally {
      setHeroLoading(false);
    }
  };

  const handleSelectStationByIdForBooking = async (stationId) => {
    try {
      const detail = await fetchStationDetail(stationId);
      handleSelectStation(detail);
      setActiveTab('finder');
    } catch (err) {
      console.error('Failed to load station detail for booking', err);
    }
  };

  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.network.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'available' && station.status === 'available') ||
      (statusFilter === 'busy' && (station.status === 'busy' || station.status === 'full'));

    return matchesSearch && matchesStatus;
  });

  return (
    <AnimatePresence mode="wait">
      {showLandingPage ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <LandingPage onEnterApp={() => setShowLandingPage(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen flex flex-col"
          style={{ backgroundColor: '#F7F6F1', color: '#141410', fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          {/* Top Navbar */}
          <header className="border-b-2 border-[#141410] px-3 sm:px-6 py-2.5 sticky top-0 z-40" style={{ backgroundColor: '#F7F6F1' }}>
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
              {/* Brand Logo & Name */}
              <div
                onClick={() => setShowLandingPage(true)}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
                title="Return to Landing Page"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#146B3A] flex items-center justify-center group-hover:bg-[#141410] transition-colors shrink-0" style={{ borderRadius: '0px' }}>
                  <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-base sm:text-xl font-black tracking-wider text-[#141410] font-display uppercase">
                      EVCONNECT <span className="text-[#146B3A]">INDIA</span>
                    </h1>
                    <span className="bg-[#146B3A] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider hidden xs:inline-block font-display" style={{ borderRadius: '0px' }}>
                      LIVE
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#6E6E64] font-body hidden sm:block">Predictive EV Charging Network — Bangalore</p>
                </div>
              </div>

              {/* Tab Switcher & Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex items-center">
                  <button
                    onClick={() => setActiveTab('finder')}
                    className={`px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border-2 border-[#141410] font-display uppercase tracking-wider ${
                      activeTab === 'finder'
                        ? 'bg-[#141410] text-white'
                        : 'bg-[#F7F6F1] text-[#141410] hover:bg-[#141410] hover:text-white'
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    <Map className="w-3.5 h-3.5" />
                    <span>STATIONS</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('planner')}
                    className={`px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border-2 border-[#141410] -ml-0.5 font-display uppercase tracking-wider ${
                      activeTab === 'planner'
                        ? 'bg-[#141410] text-white'
                        : 'bg-[#F7F6F1] text-[#141410] hover:bg-[#141410] hover:text-white'
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>TRIP PLAN</span>
                  </button>
                </div>

                <button
                  onClick={() => loadStations(false)}
                  className="p-1.5 sm:p-2 border-2 border-[#141410] bg-[#F7F6F1] hover:bg-[#141410] hover:text-white text-[#141410] transition-colors cursor-pointer"
                  title="Refresh Stations"
                  style={{ borderRadius: '0px' }}
                >
                  <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </header>

          {/* Vehicle Preset Selector */}
          <VehicleSelector
            selectedVehicle={selectedVehicle}
            onSelectVehicle={(veh) => setSelectedVehicle(veh)}
          />

          {/* Render Cold Start Banner Notice if initial fetch takes longer */}
          {slowServerNotice && (
            <div className="bg-[#D98E04]/15 border-b-2 border-[#D98E04] px-4 py-2 text-center text-xs font-semibold text-[#141410] flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#D98E04]" />
              <span>Waking up cloud server (Render free tier cold start)... Thanks for your patience!</span>
            </div>
          )}

          {/* Main */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
            {activeTab === 'finder' ? (
              <motion.div
                key="tab-finder"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 sm:space-y-6"
              >
                <HeroNearestButton
                  onFindNearest={handleFindNearest}
                  isLoading={heroLoading}
                  heroResult={heroStation}
                />

                {/* 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
                  {/* Leaflet Map (Normal flow on mobile, sticky top on desktop) */}
                  <div className="lg:col-span-7 h-[340px] sm:h-[450px] lg:h-[680px] lg:sticky lg:top-24">
                    <StationMap
                      stations={filteredStations}
                      selectedStation={selectedStation}
                      onSelectStation={handleSelectStation}
                      heroStationId={heroStation?.id}
                    />
                  </div>

                  {/* Station Detail Drawer & Search List */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-[#6E6E64] absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="Search station, network, area..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-[#F7F6F1] border-2 border-[#141410] pl-9 pr-4 py-2 text-xs text-[#141410] placeholder-[#6E6E64] focus:outline-none focus:border-[#146B3A] transition-colors font-body"
                          style={{ borderRadius: '0px' }}
                        />
                      </div>

                      <div className="flex items-center shrink-0">
                        <button
                          onClick={() => setStatusFilter('all')}
                          className={`flex-1 sm:flex-initial px-3 py-2 text-xs font-bold cursor-pointer border-2 border-[#141410] font-display uppercase ${
                            statusFilter === 'all' ? 'bg-[#141410] text-white' : 'bg-[#F7F6F1] text-[#141410]'
                          }`}
                          style={{ borderRadius: '0px' }}
                        >
                          ALL ({stations.length})
                        </button>
                        <button
                          onClick={() => setStatusFilter('available')}
                          className={`flex-1 sm:flex-initial px-3 py-2 text-xs font-bold cursor-pointer border-2 border-[#141410] -ml-0.5 font-display uppercase ${
                            statusFilter === 'available' ? 'bg-[#146B3A] text-white' : 'bg-[#F7F6F1] text-[#141410]'
                          }`}
                          style={{ borderRadius: '0px' }}
                        >
                          FREE
                        </button>
                      </div>
                    </div>

                    {/* Selected Station Detail Anchor for Mobile Auto-Scroll */}
                    <div ref={detailAnchorRef}>
                      {selectedStation && (
                        <StationDetail
                          stationId={selectedStation.id}
                          onClose={() => setSelectedStation(null)}
                          selectedVehicle={selectedVehicle}
                          onBookingSuccess={() => loadStations(true)}
                        />
                      )}
                    </div>

                    {/* Station List */}
                    <div className="border-2 border-[#141410] max-h-[480px] sm:max-h-[560px] overflow-y-auto" style={{ borderRadius: '0px' }}>
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#6E6E64] uppercase tracking-[0.12em] px-3 sm:px-4 py-2 border-b-2 border-[#141410] font-display sticky top-0 bg-[#F7F6F1] z-10">
                        <span>STATIONS ({filteredStations.length})</span>
                        <span>AVAILABILITY</span>
                      </div>

                      {loading ? (
                        <div className="py-8 text-center space-y-3">
                          <div className="h-3 voltage-loading mx-4" style={{ borderRadius: '0px' }}></div>
                          <p className="text-xs text-[#6E6E64] font-body">Fetching live station telemetry...</p>
                        </div>
                      ) : filteredStations.length === 0 ? (
                        <div className="py-8 text-center p-6 space-y-2">
                          <p className="text-sm font-bold text-[#141410] font-display">NO STATIONS FOUND</p>
                          <p className="text-xs text-[#6E6E64] font-body">Adjust search query or status filter.</p>
                        </div>
                      ) : (
                        filteredStations.map((station) => (
                          <StationCard
                            key={station.id}
                            station={station}
                            isSelected={selectedStation?.id === station.id}
                            isHero={heroStation?.id === station.id}
                            selectedVehicle={selectedVehicle}
                            onSelectStation={handleSelectStation}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* TRIP PLANNER TAB */
              <motion.div
                key="tab-planner"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start"
              >
                <div className="lg:col-span-7 h-[340px] sm:h-[450px] lg:h-[680px] lg:sticky lg:top-24">
                  <StationMap
                    stations={stations}
                    selectedStation={selectedStation}
                    onSelectStation={handleSelectStation}
                    heroStationId={heroStation?.id}
                    tripPlan={tripPlan}
                  />
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <TripPlannerView
                    selectedVehicle={selectedVehicle}
                    onSelectVehicle={(veh) => setSelectedVehicle(veh)}
                    onTripPlanned={(plan) => setTripPlan(plan)}
                    onSelectStationForBooking={handleSelectStationByIdForBooking}
                  />
                </div>
              </motion.div>
            )}
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
