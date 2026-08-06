import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine
} from 'recharts';
import { Clock, TrendingUp, AlertTriangle } from 'lucide-react';

export default function PeakHourChart({ data, loading }) {
  if (loading) {
    return (
      <div className="p-4 border-2 border-[#141410]" style={{ backgroundColor: '#F7F6F1', borderRadius: '0px' }}>
        <div className="flex justify-between items-center mb-3">
          <div className="h-4 bg-[#6E6E64]/20 w-1/3"></div>
          <div className="h-4 bg-[#6E6E64]/20 w-1/4"></div>
        </div>
        <div className="h-3 voltage-loading" style={{ borderRadius: '0px' }}></div>
      </div>
    );
  }

  if (!data || !data.hourlyTrends || data.hourlyTrends.length === 0) {
    return null;
  }

  const chartData = data.hourlyTrends.map(item => ({
    hour: item.formattedHour,
    occupancy: Math.round(item.avgOccupancyPct),
    peakLevel: item.peakLevel
  }));

  const peakHourItem = [...chartData].sort((a, b) => b.occupancy - a.occupancy)[0];

  const getBarColor = (occupancy) => {
    if (occupancy >= 75) return '#B23A2E';
    if (occupancy >= 50) return '#D98E04';
    return '#146B3A';
  };

  return (
    <div className="p-4 border-2 border-[#141410]" style={{ backgroundColor: '#F7F6F1', borderRadius: '0px' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#141410] uppercase tracking-[0.12em] font-display">
          <Clock className="w-3.5 h-3.5 text-[#146B3A]" />
          <span>HOURLY OCCUPANCY PATTERN</span>
        </div>
        {peakHourItem && (
          <div className="flex items-center gap-1 text-[11px] text-[#141410] font-semibold bg-[#D98E04]/10 px-2 py-0.5 border border-[#D98E04] font-mono-data" style={{ borderRadius: '0px' }}>
            <TrendingUp className="w-3 h-3 text-[#D98E04]" />
            <span>Peak: <strong>{peakHourItem.hour}</strong> ({peakHourItem.occupancy}%)</span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={12}>
            <XAxis
              dataKey="hour"
              tick={{ fill: '#6E6E64', fontSize: 9, fontFamily: 'IBM Plex Mono, monospace' }}
              axisLine={{ stroke: '#141410', strokeWidth: 1 }}
              tickLine={{ stroke: '#6E6E64' }}
              interval={1}
            />
            <YAxis
              tick={{ fill: '#6E6E64', fontSize: 9, fontFamily: 'IBM Plex Mono, monospace' }}
              axisLine={{ stroke: '#141410', strokeWidth: 1 }}
              tickLine={{ stroke: '#6E6E64' }}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#F7F6F1',
                border: '2px solid #141410',
                borderRadius: '0px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '11px',
                boxShadow: '2px 2px 0 #141410'
              }}
              formatter={(value) => [`${value}%`, 'Occupancy']}
              cursor={{ fill: '#141410', opacity: 0.05 }}
            />
            <ReferenceLine y={75} stroke="#B23A2E" strokeDasharray="4 4" strokeWidth={1} />
            <Bar dataKey="occupancy" isAnimationActive={true} animationDuration={800} animationBegin={100}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={getBarColor(entry.occupancy)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] text-[#6E6E64] pt-2 border-t border-[#6E6E64]/30 mt-2 font-body">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-[#146B3A]" style={{ display: 'inline-block' }}></span> Low (&lt;50%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-[#D98E04]" style={{ display: 'inline-block' }}></span> Mid (50-75%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-[#B23A2E]" style={{ display: 'inline-block' }}></span> Peak (&gt;75%)
          </span>
        </div>
        <span className="italic font-body">8–10 AM &amp; 6–9 PM rush hours</span>
      </div>
    </div>
  );
}
