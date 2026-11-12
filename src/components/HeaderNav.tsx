import React, { useState, useEffect } from 'react';
import {
  Activity,
  Radio,
  PlusCircle,
  Clock,
  Layers,
  BarChart3,
  GitBranch,
  ShieldAlert,
  Cpu,
  Bookmark,
} from 'lucide-react';

interface HeaderNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
  activeAlertCount: number;
  totalCasesCount: number;
  isStreaming: boolean;
  toggleStreaming: () => void;
  onOpenIntakeModal: () => void;
  selectedDiseaseFilter: string;
  setSelectedDiseaseFilter: (disease: string) => void;
  diseases: string[];
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeView,
  setActiveView,
  activeAlertCount,
  totalCasesCount,
  isStreaming,
  toggleStreaming,
  onOpenIntakeModal,
  selectedDiseaseFilter,
  setSelectedDiseaseFilter,
  diseases,
}) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toISOString().slice(0, 19).replace('T', ' ') + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Surveillance Atlas', icon: Layers },
    { id: 'regions', label: 'Sector Dossiers', icon: Activity },
    { id: 'clusters', label: 'Contagion Clusters', icon: GitBranch },
    { id: 'forecast', label: 'SIR Forecast', icon: BarChart3 },
    { id: 'reports', label: 'Alerts & Triage', icon: ShieldAlert, badge: activeAlertCount },
    { id: 'benchmarks', label: 'Engine Telemetry', icon: Cpu },
  ];

  return (
    <header className="bg-[#FFFFFF] border-b border-[#E7E1D8] text-[#1C1917] shrink-0 sticky top-0 z-40 select-none shadow-xs">
      {/* Top Ministerial Protocol Ribbon (Deep Warm Espresso) */}
      <div className="h-9 px-4 sm:px-6 bg-[#262220] border-b border-[#38332F] flex items-center justify-between text-[11px] font-mono text-[#D6CEBE]">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isStreaming ? 'bg-amber-400' : 'bg-emerald-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isStreaming ? 'bg-amber-400' : 'bg-emerald-400'
              }`} />
            </span>
            <span className="font-bold tracking-wider text-white">OUTBREAKWATCH</span>
            <span className="text-[#78716C]">/</span>
            <span className="text-[#E7E2D8] font-medium hidden md:inline">
              PUBLIC HEALTH DIRECTIVE · EPIDEMIOLOGICAL SURVEILLANCE
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-[#A8A29E]">
            <span>Sectors: <strong className="text-white font-semibold">12 Monitored</strong></span>
            <span>·</span>
            <span>Surge Epicenters: <strong className="text-[#FDA4AF] font-bold">{activeAlertCount}</strong></span>
            <span>·</span>
            <span>Verified Intakes: <strong className="text-[#FDE68A] font-semibold">{totalCasesCount.toLocaleString()}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#D6CEBE]">
            <Clock className="w-3.5 h-3.5 text-[#A8A29E]" />
            <span className="tabular-nums text-white font-semibold">{timeString || '2026-11-11 23:05:00 UTC'}</span>
          </div>

          <div className="h-3 w-px bg-[#44403C] hidden sm:block" />

          {/* Continuous Stream Pulse Switch */}
          <button
            onClick={toggleStreaming}
            className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono transition-all flex items-center gap-1.5 border ${
              isStreaming
                ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A] shadow-xs'
                : 'bg-[#38332F] hover:bg-[#44403C] text-[#E7E2D8] border-[#44403C]'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>{isStreaming ? 'STREAM: ACTIVE (2s)' : 'STREAM: PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Main Warm Pastel Navigation Bar */}
      <div className="h-14 px-4 sm:px-6 bg-[#FFFFFF] flex items-center justify-between gap-4">
        {/* Module Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`relative px-3.5 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] ${
                  isActive
                    ? 'bg-[#FFEDD5] text-[#9A3412] font-bold shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F2EB]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C2410C]' : 'text-[#78716C]'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="font-mono text-[9px] px-1.5 py-0.2 rounded-full bg-[#E11D48] text-white font-bold ml-0.5 shadow-xs">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#C2410C] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Pathogen Filter & Primary Intake CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#78716C] uppercase">Pathogen:</span>
            <select
              value={selectedDiseaseFilter}
              onChange={(e) => setSelectedDiseaseFilter(e.target.value)}
              className="text-xs font-mono bg-[#FAF7F2] border border-[#E7E1D8] text-[#1C1917] rounded-md px-2.5 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]"
            >
              <option value="ALL">All Pathogens ({totalCasesCount})</option>
              {diseases.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenIntakeModal}
            className="px-3.5 py-1.5 bg-[#C2410C] hover:bg-[#9A3412] active:bg-[#7C2D12] text-white font-bold text-xs rounded-md transition-all flex items-center gap-1.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Admission</span>
          </button>
        </div>
      </div>
    </header>
  );
};
