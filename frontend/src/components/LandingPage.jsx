import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Clock, ShieldCheck, Navigation, BatteryCharging, MapPin, Activity } from 'lucide-react';

const LandingPage = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-[#F7F6F1] text-[#141410] flex flex-col" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {/* 1. Top nav bar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-4 border-b-2 border-[#141410]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#146B3A] flex items-center justify-center" style={{ borderRadius: '0px' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-black text-xl uppercase tracking-wider">
            EVConnect <span className="text-[#146B3A]">India</span>
          </span>
        </div>
        <div className="flex items-center gap-2 border-2 border-[#141410] px-3 py-1" style={{ borderRadius: '0px' }}>
          <div className="w-2 h-2 bg-[#146B3A]"></div>
          <span className="font-mono-data text-xs font-bold tracking-widest">18 STATIONS LIVE</span>
        </div>
      </nav>

      {/* 2. Thin voltage stripe */}
      <div className="voltage-stripe w-full" style={{ height: '6px' }}></div>

      {/* Main Content */}
      <main className="flex-grow px-6 md:px-12 py-12 md:py-16 max-w-5xl mx-auto w-full">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-4 h-4 text-[#146B3A]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#6E6E64] font-display">
              Predictive EV Charging Network — Bangalore
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.92] tracking-tight mb-10">
            Don't just find{' '}
            <br className="hidden md:block" />
            a charger —
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">know if a slot</span>
              <span className="absolute bottom-1 left-0 w-full h-3 md:h-4 bg-[#146B3A]/15 -z-0"></span>
            </span>
            <br />
            is{' '}
            <span className="text-[#146B3A] relative inline-block">
              available
              <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#146B3A]"></span>
            </span>.
          </h1>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="grid grid-cols-3 border-2 border-[#141410] mb-10 max-w-lg"
            style={{ borderRadius: '0px' }}
          >
            <div className="text-center py-3 px-2 border-r border-[#141410]">
              <div className="font-mono-data text-2xl md:text-3xl font-bold text-[#146B3A]">18</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E64] font-display">Stations</div>
            </div>
            <div className="text-center py-3 px-2 border-r border-[#141410]">
              <div className="font-mono-data text-2xl md:text-3xl font-bold text-[#141410]">96</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E64] font-display">Slots</div>
            </div>
            <div className="text-center py-3 px-2">
              <div className="font-mono-data text-2xl md:text-3xl font-bold text-[#D98E04]">24/7</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E64] font-display">Live Data</div>
            </div>
          </motion.div>

          {/* The Problem block */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mb-10 max-w-2xl"
          >
            <div className="text-[#6E6E64] text-[10px] font-bold tracking-[0.2em] uppercase mb-2 font-display">The Problem</div>
            <div className="border-2 border-[#141410] bg-white p-5 md:p-6" style={{ borderRadius: '0px', boxShadow: '4px 4px 0 #141410' }}>
              <p className="text-base md:text-lg leading-relaxed">
                "India has 12,000+ public EV charging stations for 1.4 billion people. Range anxiety isn't
                <em> 'where's a charger'</em> — it's <em>'will I be stuck waiting 40 minutes when I get there.'</em>{' '}
                <strong className="text-[#146B3A]">EVConnect solves the real problem:</strong> predictive availability, not just location."
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-start gap-4 mb-16"
          >
            <button
              onClick={onEnterApp}
              className="group flex items-center gap-3 bg-[#141410] text-white px-8 py-4 font-display font-bold text-lg uppercase tracking-wider border-2 border-[#141410] transition-all active:translate-y-[3px] active:translate-x-[3px] cursor-pointer hover:gap-5"
              style={{ borderRadius: '0px', boxShadow: '3px 3px 0 #146B3A' }}
              onMouseDown={(e) => e.currentTarget.style.boxShadow = '0px 0px 0 #146B3A'}
              onMouseUp={(e) => e.currentTarget.style.boxShadow = '3px 3px 0 #146B3A'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '3px 3px 0 #146B3A'}
            >
              <BatteryCharging className="w-5 h-5" />
              Enter App
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <span className="text-xs text-[#6E6E64] pt-2 font-body">
              Real-time data • No sign-up required
            </span>
          </motion.div>
        </motion.div>

        {/* Features Ledger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#6E6E64] mb-3 font-display">
            Platform Capabilities
          </div>
          <div className="border-2 border-[#141410]" style={{ borderRadius: '0px' }}>
            {[
              { icon: <Zap className="w-5 h-5" />, title: "Smart Scoring", desc: "Dynamic station ranking based on distance + real-time slot occupancy.", tag: "LIVE" },
              { icon: <Clock className="w-5 h-5" />, title: "Wait Prediction", desc: "ML-based estimated wait times from 24-hour usage pattern analysis.", tag: "AI" },
              { icon: <ShieldCheck className="w-5 h-5" />, title: "Slot Reservation", desc: "Lock your charging slot before arrival with instant booking confirmation.", tag: "BOOK" },
              { icon: <Navigation className="w-5 h-5" />, title: "Trip Planner", desc: "Multi-stop route planning with battery range evaluation via OSRM.", tag: "ROUTE" }
            ].map((feature, i) => (
              <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i < 3 ? 'border-b border-[#141410]' : ''} hover:bg-[#141410]/[0.02] transition-colors`}>
                <div className="w-10 h-10 bg-[#146B3A]/10 border border-[#146B3A]/30 flex items-center justify-center text-[#146B3A] shrink-0" style={{ borderRadius: '0px' }}>
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-sm uppercase tracking-wider">{feature.title}</div>
                  <div className="text-[#6E6E64] text-sm mt-0.5">{feature.desc}</div>
                </div>
                <span className="font-mono-data text-[10px] font-bold text-[#146B3A] bg-[#146B3A]/10 px-2 py-0.5 border border-[#146B3A]/30 shrink-0 hidden sm:block" style={{ borderRadius: '0px' }}>
                  {feature.tag}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-6 mt-auto border-t-2 border-[#141410] text-center">
        <div className="text-[#6E6E64] text-xs font-medium font-body">
          EVConnect India — Built for Bangalore's EV Infrastructure
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
