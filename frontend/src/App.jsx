import React, { useState, useEffect } from 'react';
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
import { Zap, Search, RefreshCw, Navigation, Map, ArrowLeft } from 'lucide-react';

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

  const loadStations = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const data = await fetchStations();
      setStations(data);
    } catch (err) {
      console.error('Failed to load stations', err);
    } finally {
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

  const handleFindNearest = async () => {
    setHeroLoading(true);
    try {
      const ranked = await fetchNearestAvailable(12.9716, 77.5946, 25);
      if (ranked && ranked.length > 0) {
        const topMatch = ranked[0];
        setStations(ranked);
        setHeroStation(topMatch);
        setSelectedStation(topMatch);
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
      setSelectedStation(detail);
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
          <header className="border-b-2 border-[#141410] px-4 py-3 sticky top-0 z-40" style={{ backgroundColor: '#F7F6F1' }}>
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
              <div
                onClick={() => setShowLandingPage(true)}
                className="flex items-center gap-3 cursor-pointer group"
                title="Return to Landing Page"
              >
                <div className="w-10 h-10 bg-[#146B3A] flex items-center justify-center group-hover:bg-[#141410] transition-colors" style={{ borderRadius: '0px' }}>
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-black tracking-wider text-[#141410] font-display uppercase">
                      EVCONNECT <span className="text-[#146B3A]">INDIA</span>
                    </h1>
                    <span className="bg-[#146B3A] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider hidden sm:inline-block font-display" style={{ borderRadius: '0px' }}>
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E6E64] font-body">Predictive EV Charging Network — Bangalore</p>
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="flex items-center">
                <button
                  onClick={() => setActiveTab('finder')}
                  className={`px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-2 border-[#141410] font-display uppercase tracking-wider ${
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
                  className={`px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-2 border-[#141410] -ml-0.5 font-display uppercase tracking-wider ${
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

              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => loadStations(false)}
                  className="p-2 border-2 border-[#141410] bg-[#F7F6F1] hover:bg-[#141410] hover:text-white text-[#141410] transition-colors cursor-pointer"
                  title="Refresh Stations"
                  style={{ borderRadius: '0px' }}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </header>

          {/* Vehicle Preset Selector */}
          <VehicleSelector
            selectedVehicle={selectedVehicle}
            onSelectVehicle={(veh) => setSelectedVehicle(veh)}
          />

          {/* Main */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
            {activeTab === 'finder' ? (
              <motion.div
                key="tab-finder"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <HeroNearestButton
                  onFindNearest={handleFindNearest}
                  isLoading={heroLoading}
                  heroResult={heroStation}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7 h-[450px] lg:h-[680px] sticky top-24">
                    <StationMap
                      stations={filteredStations}
                      selectedStation={selectedStation}
                      onSelectStation={(st) => setSelectedStation(st)}
                      heroStationId={heroStation?.id}
                    />
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    {/* Search & Filter */}
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
                          className={`px-3 py-2 text-xs font-bold cursor-pointer border-2 border-[#141410] font-display uppercase ${
                            statusFilter === 'all' ? 'bg-[#141410] text-white' : 'bg-[#F7F6F1] text-[#141410]'
                          }`}
                          style={{ borderRadius: '0px' }}
                        >
                          ALL ({stations.length})
                        </button>
                        <button
                          onClick={() => setStatusFilter('available')}
                          className={`px-3 py-2 text-xs font-bold cursor-pointer border-2 border-[#141410] -ml-0.5 font-display uppercase ${
                            statusFilter === 'available' ? 'bg-[#146B3A] text-white' : 'bg-[#F7F6F1] text-[#141410]'
                          }`}
                          style={{ borderRadius: '0px' }}
                        >
                          FREE
                        </button>
                      </div>
                    </div>

                    {/* Station Detail */}
                    {selectedStation && (
                      <StationDetail
                        stationId={selectedStation.id}
                        onClose={() => setSelectedStation(null)}
                        selectedVehicle={selectedVehicle}
                        onBookingSuccess={() => loadStations(true)}
                      />
                    )}

                    {/* Station List */}
                    <div className="border-2 border-[#141410] max-h-[560px] overflow-y-auto" style={{ borderRadius: '0px' }}>
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#6E6E64] uppercase tracking-[0.12em] px-4 py-2 border-b-2 border-[#141410] font-display" style={{ backgroundColor: '#F7F6F1' }}>
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
                            onSelectStation={(st) => setSelectedStation(st)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="tab-planner"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
                <div className="lg:col-span-7 h-[450px] lg:h-[680px] sticky top-24">
                  <StationMap
                    stations={stations}
                    selectedStation={selectedStation}
                    onSelectStation={(st) => setSelectedStation(st)}
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
