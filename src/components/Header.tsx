import React, { useState, useEffect } from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReportModal: () => void;
  isStreaming: boolean;
  toggleStreaming: () => void;
  activeAlertCount: number;
  totalCaseCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  isStreaming,
  toggleStreaming,
  activeAlertCount,
  totalCaseCount,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toISOString().slice(11, 19) + ' UTC · ' + now.toISOString().slice(0, 10)
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Surveillance' },
    { id: 'intake', label: 'Pipeline Intake' },
    { id: 'graph', label: 'Region Graph' },
    { id: 'sir', label: 'SIR Forecast' },
    { id: 'classifier', label: 'Symptom AI' },
    { id: 'dsa', label: 'Engine Telemetry' },
    { id: 'alerts', label: `Alerts (${activeAlertCount})` },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0e1420]/95 backdrop-blur-md border-b border-slate-800/90 text-slate-100">
      {/* Top Clinical Telemetry Ribbon */}
      <div className="border-b border-slate-800/60 bg-[#090d15] px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] font-mono flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-bold tracking-wider">● EPIDEMIOLOGY WORKSTATION</span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">SYSTEM STATUS: NOMINAL</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-slate-300">
            TOTAL INGESTION: <strong className="text-cyan-300 font-bold tabular-nums">{totalCaseCount.toLocaleString()}</strong> CASES
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 tabular-nums">{currentTime}</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">PBL REVIEW 1+2 DEFENSE</span>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-15">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center font-mono font-bold text-white text-sm shadow-xs border border-cyan-400/30">
                PT
              </div>
              <div>
                <div className="text-base font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap">
                  PathoTrace AI
                </div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 -mt-0.5">
                  Surveillance Operations Console
                </div>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-300">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative py-1.5 text-xs font-mono tracking-tight transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-cyan-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleStreaming}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-all whitespace-nowrap border ${
                isStreaming
                  ? 'bg-amber-950/60 text-amber-300 border-amber-600/80 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-700'
              }`}
            >
              {isStreaming ? 'Stream: Ingesting (2s)' : '▶ Live Stream'}
            </button>
            <button
              onClick={onOpenReportModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:scale-95 transition-all whitespace-nowrap rounded font-mono shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            >
              + Case Intake
            </button>
          </div>
        </div>

        {/* Mobile / Horizontal Nav Scroll */}
        <div className="xl:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-800 no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-xs font-mono py-1 px-2.5 whitespace-nowrap rounded border ${
                activeTab === item.id
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800 font-semibold'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
