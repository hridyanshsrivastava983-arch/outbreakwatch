import React from 'react';
import {
  ShieldAlert,
  Activity,
  ArrowUpRight,
  Radio,
  Layers,
  GitBranch,
  TrendingUp,
  Cpu,
  ChevronRight,
} from 'lucide-react';

interface EntryScreenProps {
  onEnter: (targetView?: string) => void;
  sectorCount: number;
  totalRecordsCount: number;
  activeSurgeCount: number;
}

export const EntryScreen: React.FC<EntryScreenProps> = ({
  onEnter,
  sectorCount,
  totalRecordsCount,
  activeSurgeCount,
}) => {
  return (
    <div className="min-h-screen bg-[#090A0C] text-[#F3F4F6] relative overflow-x-hidden selection:bg-[#FACC15] selection:text-black font-sans">
      {/* Ambient Lighting - Soft diffuse yellow/lime glow from the reference image */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.08)_0%,rgba(202,138,4,0.03)_40%,transparent_70%)] pointer-events-none z-0" />
      <div className="absolute top-[400px] right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* Top Sleek Minimal Navigation Bar */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/[0.06]">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onEnter('overview')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FACC15] to-[#CA8A04] flex items-center justify-center text-black font-bold text-sm shadow-[0_0_20px_rgba(250,204,21,0.3)]">
            OW
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-sans">
            OutbreakWatch
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60 border border-white/[0.08]">
            EPIDEMIC SURVEILLANCE DIRECTIVE
          </span>
        </div>

        {/* Center Minimal Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-white/60">
          <button onClick={() => onEnter('overview')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">Surveillance Atlas</button>
          <button onClick={() => onEnter('clusters')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">Contagion Graph</button>
          <button onClick={() => onEnter('forecast')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">Predictive SIR</button>
          <button onClick={() => onEnter('intake')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">Clinical Intake</button>
        </nav>

        {/* Right CTA Button (Electric Yellow Pill like reference image) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>12 Sectors Live</span>
          </div>

          <button
            onClick={() => onEnter('overview')}
            className="group px-5 py-2.5 rounded-full bg-[#FACC15] hover:bg-[#FDE047] active:bg-[#EAB308] text-black text-xs font-bold font-sans tracking-wide transition-all duration-200 flex items-center gap-2 shadow-[0_0_25px_rgba(250,204,21,0.25)] hover:shadow-[0_0_35px_rgba(250,204,21,0.4)]"
          >
            <span>Launch Console</span>
            <div className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ArrowUpRight className="w-3 h-3 text-black" />
            </div>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Hero Content (7 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Small subtle status pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
              <span>EARLY WARNING &amp; CONTAGION CONTAINMENT PLATFORM</span>
            </div>

            {/* Giant Clean Headline with Em-dash (matching reference image) */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-sans">
              We Track — <br />
              <span className="text-white/90">Outbreaks that</span> <br />
              <span className="text-white">Threaten Public Health</span>
            </h1>

            {/* Sub-headline with Highlighted Accent Words */}
            <p className="text-base sm:text-lg text-white/60 font-normal leading-relaxed max-w-2xl pt-2">
              Continuous biosurveillance engine correlating hospital diagnostic intakes, detecting micro-anomalies against 35-day epidemiological baselines —{' '}
              <span className="text-[#FACC15] font-semibold">helping health authorities isolate epicenters</span>,{' '}
              <span className="text-white font-medium">optimize critical resources</span>, and{' '}
              <span className="text-white font-medium">contain regional transmission faster</span>.
            </p>

            {/* Big Luminous CTA Pill Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => onEnter('overview')}
                autoFocus
                className="group px-8 py-4 rounded-full bg-[#FACC15] hover:bg-[#FDE047] active:bg-[#EAB308] text-black text-sm font-extrabold font-sans tracking-wide transition-all duration-200 flex items-center gap-3 shadow-[0_0_35px_rgba(250,204,21,0.35)] hover:shadow-[0_0_50px_rgba(250,204,21,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <span>Enter Surveillance Console</span>
                <div className="w-5 h-5 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                </div>
              </button>

              <span className="text-xs font-mono text-white/40">
                Press Enter or click to initialize live operations
              </span>
            </div>
          </div>

          {/* Right Floating Badge (Matching the flower/circular badge in reference image) */}
          <div className="lg:col-span-4 flex lg:justify-end">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.1] backdrop-blur-xl shadow-2xl flex flex-col justify-between max-w-xs w-full">
              <div className="flex items-center justify-between mb-6">
                <div className="w-3 h-3 rounded-full bg-[#FACC15] animate-ping" />
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
                  SURVEILLANCE METRICS
                </span>
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white font-sans tracking-tight">
                  {sectorCount}+
                </div>
                <div className="text-xs text-[#FACC15] font-semibold mt-1">
                  Districts Under Surveillance
                </div>
                <div className="text-xs text-white/50 mt-1 font-normal leading-snug">
                  Continuous multi-sector biosurveillance with automated surge anomaly detection.
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-white/60">
                <span>Active Surges:</span>
                <span className="font-bold text-[#F87171]">{activeSurgeCount} Hotspots</span>
              </div>
            </div>
          </div>
        </div>

        {/* Showcase Gallery: 4 Dark Interface Device Mockup Cards (Faithful to Reference Image) */}
        <div className="mt-16 pt-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-white/40">
              Live Operational Dashboards &amp; Predictive Modules
            </span>
            <span className="text-xs font-mono text-[#FACC15]">
              Real-Time Feed Nominal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Smartphone / Mobile Risk Meter (Reference: Phone with circular 68 gauge) */}
            <div
              onClick={() => onEnter('overview')}
              className="group p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 cursor-pointer flex flex-col justify-between h-64 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/50">SECTOR RISK GAUGE</span>
                <div className="w-2 h-2 rounded-full bg-[#FACC15]" />
              </div>

              {/* Gauge visual */}
              <div className="my-auto flex flex-col items-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                      fill="none"
                      stroke="#FACC15"
                      strokeWidth="3.5"
                      strokeDasharray="68, 100"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black font-sans text-white">74</span>
                    <span className="text-[9px] font-mono text-white/50">ALERT INDEX</span>
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-white/80 mt-2">
                  High-Surge Hotspot
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/[0.06]">
                <span>East Harbour</span>
                <span className="text-[#FACC15] group-hover:translate-x-1 transition-transform">Explore Atlas →</span>
              </div>
            </div>

            {/* Card 2: Surge Anomaly Stream (Reference: Phone 2 with dark text listing) */}
            <div
              onClick={() => onEnter('reports')}
              className="group p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 cursor-pointer flex flex-col justify-between h-64"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/50">ANOMALY DETECTOR</span>
                <Activity className="w-3.5 h-3.5 text-[#FACC15]" />
              </div>

              <div className="space-y-2 my-auto">
                <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                  <div className="text-[10px] font-mono text-rose-400 font-semibold">● DENGUE SURGE DETECTED</div>
                  <div className="text-xs font-bold text-white mt-0.5">3.2× Above 7-Day Baseline</div>
                  <div className="text-[10px] text-white/50 mt-0.5">Z-Score: +3.68σ · Urgent Heap Root</div>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[10px] font-mono text-white/40">
                  Influenza: Baseline normal (+0.4σ)
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/[0.06]">
                <span>Triage Max-Heap</span>
                <span className="text-[#FACC15] group-hover:translate-x-1 transition-transform">View Alerts →</span>
              </div>
            </div>

            {/* Card 3: Laptop screen with '022' network graphics (Reference: Laptop screen) */}
            <div
              onClick={() => onEnter('clusters')}
              className="group p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 cursor-pointer flex flex-col justify-between h-64 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/50">CONTAGION NETWORK</span>
                <GitBranch className="w-3.5 h-3.5 text-[#FACC15]" />
              </div>

              {/* Connected node graphic */}
              <div className="my-auto py-2">
                <div className="relative h-20 w-full flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 160 80">
                    <line x1="25" y1="40" x2="80" y2="25" stroke="#FACC15" strokeWidth="2" strokeDasharray="3 2" />
                    <line x1="80" y1="25" x2="135" y2="40" stroke="#FACC15" strokeWidth="2" />
                    <line x1="80" y1="25" x2="80" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <circle cx="25" cy="40" r="8" fill="#1C1917" stroke="#FACC15" strokeWidth="2" />
                    <circle cx="80" cy="25" r="10" fill="#FACC15" stroke="#FFF" strokeWidth="2" />
                    <circle cx="135" cy="40" r="8" fill="#1C1917" stroke="#FACC15" strokeWidth="2" />
                    <circle cx="80" cy="65" r="6" fill="#1C1917" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="text-center text-xs font-bold text-white">
                  Fastest Commuter Spread Path
                </div>
                <div className="text-center text-[10px] font-mono text-white/50">
                  Dijkstra Travel-Weighted Corridor
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/[0.06]">
                <span>Union-Find Clusters</span>
                <span className="text-[#FACC15] group-hover:translate-x-1 transition-transform">Inspect Graph →</span>
              </div>
            </div>

            {/* Card 4: Black Hardware Appliance (Reference: 000 device block) */}
            <div
              onClick={() => onEnter('forecast')}
              className="group p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 cursor-pointer flex flex-col justify-between h-64"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/50">SIR TRANSMISSION FORECAST</span>
                <TrendingUp className="w-3.5 h-3.5 text-[#FACC15]" />
              </div>

              <div className="my-auto space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] font-mono text-white/60">REPRODUCTION RATE</span>
                  <span className="text-2xl font-black font-mono text-[#FACC15]">R₀ = 2.71</span>
                </div>

                {/* Mini SVG Curve */}
                <div className="h-10 w-full">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path
                      d="M 0 28 Q 30 27, 45 6 Q 60 2, 75 18 T 100 27"
                      fill="none"
                      stroke="#FACC15"
                      strokeWidth="2.5"
                    />
                    <line x1="50" y1="0" x2="50" y2="30" stroke="#F87171" strokeWidth="1" strokeDasharray="2 2" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-white/60">
                  <span>Peak Inpatient Day: Day 42</span>
                  <span className="text-rose-400 font-bold">Surge Load</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/[0.06]">
                <span>Simulation Deck</span>
                <span className="text-[#FACC15] group-hover:translate-x-1 transition-transform">Run SIR →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Second Section: "We Deliver — Comprehensive Solutions" (Matching right-side of reference image) */}
        <div className="mt-24 pt-12 border-t border-white/[0.08]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left title and description */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-mono uppercase text-[#FACC15] font-semibold tracking-wider">
                CORE CAPABILITIES
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                We Deliver — Comprehensive Solutions to Protect Populations.
              </h2>
              <p className="text-sm text-white/60 leading-relaxed font-normal">
                Engineered for municipal departments, district health directorates, and global epidemiologists needing real-time situational clarity during active viral surges.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onEnter('benchmarks')}
                  className="px-6 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-white transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Engine Telemetry</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#FACC15]" />
                </button>
              </div>
            </div>

            {/* Right Capability List (Matching Branding / UI-UX / Web Dev row format from reference image) */}
            <div className="lg:col-span-7 space-y-3">
              {/* Row 1 */}
              <div
                onClick={() => onEnter('clusters')}
                className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#FACC15] font-bold">
                    01
                  </div>
                  <div>
                    <div className="text-base font-bold text-white group-hover:text-[#FACC15] transition-colors">
                      District Contagion &amp; Vector Transmission Networks
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">
                      Highway commuter-weighted spread paths &amp; automated cluster isolation perimeters.
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-[#FACC15] transition-colors" />
              </div>

              {/* Row 2 */}
              <div
                onClick={() => onEnter('reports')}
                className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#FACC15] font-bold">
                    02
                  </div>
                  <div>
                    <div className="text-base font-bold text-white group-hover:text-[#FACC15] transition-colors">
                      Real-Time Surge Anomaly Detection
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">
                      35-day rolling baselines, dynamic z-score deviation, and max-heap alert triage.
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-[#FACC15] transition-colors" />
              </div>

              {/* Row 3 */}
              <div
                onClick={() => onEnter('forecast')}
                className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#FACC15] font-bold">
                    03
                  </div>
                  <div>
                    <div className="text-base font-bold text-white group-hover:text-[#FACC15] transition-colors">
                      SIR Compartmental Mathematical Forecasting
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">
                      Interactive parameter what-if scenarios modeling hospital surge loads and herd immunity.
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-[#FACC15] transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Third Section: High-Yield Key Metrics Strip (Matching bottom of reference image) */}
        <div className="mt-20 p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
            <div>
              <div className="text-xs font-mono text-[#FACC15] uppercase tracking-wider mb-1">
                SYSTEM SUMMARY
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Continuous, fast, and predictive biosurveillance intelligence.
              </h3>
            </div>

            <button
              onClick={() => onEnter('overview')}
              className="px-6 py-3 rounded-full bg-[#FACC15] hover:bg-[#FDE047] text-black text-xs font-bold transition-all flex items-center gap-2 self-start md:self-auto shrink-0 shadow-[0_0_20px_rgba(250,204,21,0.3)] cursor-pointer"
            >
              <span>Initialize System</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 font-mono">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                {sectorCount} Districts
              </div>
              <div className="text-xs text-white/50 mt-1">Continuous sector tracking</div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                {totalRecordsCount.toLocaleString()}
              </div>
              <div className="text-xs text-white/50 mt-1">Indexed clinical cases</div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F87171] tabular-nums">
                {activeSurgeCount} Hotspots
              </div>
              <div className="text-xs text-white/50 mt-1">Surges flagged for containment</div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
                &lt; 5 ms
              </div>
              <div className="text-xs text-white/50 mt-1">Sub-millisecond query latency</div>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Minimalist Institutional Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 text-xs font-mono text-white/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white/70">OUTBREAKWATCH</span>
            <span>·</span>
            <span>GLOBAL BIOSURVEILLANCE &amp; EPIDEMIC INTELLIGENCE INITIATIVE</span>
          </div>

          <div>
            OFFICIAL CLEARANCE ONLY · CONFIDENTIAL HEALTH INTELLIGENCE
          </div>
        </div>
      </footer>
    </div>
  );
};
