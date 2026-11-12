import React from 'react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  selectedDiseaseFilter: string;
  setSelectedDiseaseFilter: (disease: string) => void;
  diseases: string[];
  activeAlertCount: number;
  totalCasesCount: number;
  onOpenIntakeModal: () => void;
  onExitToGateway: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  selectedDiseaseFilter,
  setSelectedDiseaseFilter,
  diseases,
  activeAlertCount,
  totalCasesCount,
  onOpenIntakeModal,
  onExitToGateway,
}) => {
  const navItems = [
    { id: 'overview', label: 'Surveillance Atlas' },
    { id: 'regions', label: 'Sector Dossiers' },
    { id: 'clusters', label: 'Contagion Clusters' },
    { id: 'forecast', label: 'SIR Transmission Forecast' },
    { id: 'reports', label: 'Alerts & Situation Reports' },
    { id: 'intake', label: 'Clinical Intake Pipeline' },
    { id: 'benchmarks', label: 'Engine Telemetry' },
  ];

  return (
    <aside className="w-64 bg-[#FFFFFF] text-[#292524] flex flex-col shrink-0 border-r border-[#E7E1D8] select-none shadow-xs">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#E7E1D8] bg-[#FAF7F2]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold tracking-tight text-[#1C1917] font-mono uppercase">
            OutbreakWatch
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FEF3C7] text-[#92400E] font-bold rounded">
            EPIDEMIC v4.2
          </span>
        </div>
        <div className="text-[11px] text-[#78716C] mt-1 font-sans">
          Public Health Epidemiological Directorate
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="p-3">
        <div className="text-[10px] font-mono text-[#A8A29E] uppercase tracking-wider px-2 mb-1.5 font-bold">
          Operations Directorate
        </div>
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full text-left px-2.5 py-2 text-xs font-medium rounded-md transition-all flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] ${
                  isActive
                    ? 'bg-[#FFEDD5] text-[#9A3412] font-bold shadow-xs'
                    : 'text-[#57534E] hover:bg-[#F5F2EB] hover:text-[#1C1917]'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'reports' && activeAlertCount > 0 && (
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-[#E11D48] text-white font-bold shadow-xs">
                    {activeAlertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pathogen Filter */}
      <div className="p-3 border-t border-[#E7E1D8]">
        <div className="text-[10px] font-mono text-[#A8A29E] uppercase tracking-wider px-2 mb-1.5 font-bold">
          Pathogen Categorization
        </div>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedDiseaseFilter('ALL')}
            className={`w-full text-left px-2 py-1.5 text-xs rounded-md transition-colors font-mono flex items-center justify-between ${
              selectedDiseaseFilter === 'ALL'
                ? 'bg-[#F5F2EB] text-[#1C1917] font-bold'
                : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF7F2]'
            }`}
          >
            <span>All Pathogens</span>
            <span className="text-[10px] tabular-nums text-[#78716C]">
              {totalCasesCount}
            </span>
          </button>
          {diseases.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDiseaseFilter(d)}
              className={`w-full text-left px-2 py-1.5 text-xs rounded-md transition-colors truncate font-mono ${
                selectedDiseaseFilter === d
                  ? 'bg-[#FFEDD5] text-[#9A3412] font-bold'
                  : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF7F2]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto p-3 border-t border-[#E7E1D8] bg-[#FAF7F2] space-y-2">
        <button
          onClick={onOpenIntakeModal}
          className="w-full py-2 px-3 bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-semibold rounded-md text-center transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]"
        >
          + Log Clinical Intake
        </button>

        <button
          onClick={onExitToGateway}
          className="w-full py-1.5 px-3 bg-white hover:bg-[#F5F2EB] text-[#78716C] hover:text-[#1C1917] text-[11px] font-mono rounded-md border border-[#E7E1D8] text-center transition-colors"
        >
          Return to Access Gateway
        </button>
      </div>
    </aside>
  );
};
