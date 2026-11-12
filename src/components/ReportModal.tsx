import React, { useState } from 'react';
import { RegionNode, CaseReport, AgeGroup, SeverityLevel } from '../types/epidemiology';
import { COMMON_DISEASES, COMMON_SYMPTOMS } from '../data/initialData';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  regions: RegionNode[];
  onManualSubmit: (report: Omit<CaseReport, 'id' | 'recordedAt' | 'patientHash'>) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  regions,
  onManualSubmit,
}) => {
  if (!isOpen) return null;

  const [disease, setDisease] = useState<string>(COMMON_DISEASES[0]);
  const [regionId, setRegionId] = useState<string>(regions[0].id);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('18-49');
  const [severity, setSeverity] = useState<SeverityLevel>(3);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'High fever',
    'Severe joint pain',
  ]);
  const [facility, setFacility] = useState<string>('District Medical Center');

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const regionObj = regions.find((r) => r.id === regionId) || regions[0];

    onManualSubmit({
      disease,
      regionId,
      regionName: regionObj.name,
      date,
      ageGroup,
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ['Unspecified fever'],
      severity,
      facility,
    });

    onClose();
  };

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
    >
      <div className="bg-white rounded-xl shadow-2xl border border-[#E7E1D8] w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7E1D8]">
          <div>
            <h2 className="text-base font-bold text-[#1C1917]">
              Clinical Case Report Intake
            </h2>
            <div className="text-xs text-[#78716C]">
              Continuous Ingestion Queue &amp; Real-Time Anomaly Evaluation
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#FAF7F2] hover:bg-[#F0EBE1] text-[#78716C] hover:text-[#1C1917] flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            title="Close modal (Esc)"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-[#44403C] mb-1">
              Confirmed / Suspected Disease:
            </label>
            <select
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              className="w-full bg-white border border-[#D6D3D1] rounded p-2 text-[#1C1917] font-medium focus:ring-1 focus:ring-[#C2410C]"
            >
              {COMMON_DISEASES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#44403C] mb-1">
                District Region:
              </label>
              <select
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="w-full bg-white border border-[#D6D3D1] rounded p-2 text-[#1C1917] font-medium focus:ring-1 focus:ring-[#C2410C]"
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#44403C] mb-1">
                Report Date:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-[#D6D3D1] rounded p-2 font-mono text-[#1C1917] focus:ring-1 focus:ring-[#C2410C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#44403C] mb-1">
                Age Demographic:
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                className="w-full bg-white border border-[#D6D3D1] rounded p-2 text-[#1C1917] font-medium focus:ring-1 focus:ring-[#C2410C]"
              >
                <option value="0-17">0-17 (Pediatric)</option>
                <option value="18-49">18-49 (Adult)</option>
                <option value="50-64">50-64 (Middle-aged)</option>
                <option value="65+">65+ (Geriatric)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#44403C] mb-1">
                Severity Score (1-5):
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value) as SeverityLevel)}
                className="w-full bg-white border border-[#D6D3D1] rounded p-2 font-mono text-[#1C1917] focus:ring-1 focus:ring-[#C2410C]"
              >
                <option value={1}>1 - Mild</option>
                <option value={2}>2 - Moderate</option>
                <option value={3}>3 - Serious Inpatient</option>
                <option value={4}>4 - Severe ICU</option>
                <option value={5}>5 - Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#44403C] mb-1">
              Submitting Medical Center:
            </label>
            <input
              type="text"
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              className="w-full bg-white border border-[#D6D3D1] rounded p-2 text-[#1C1917] focus:ring-1 focus:ring-[#C2410C]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#44403C] mb-1.5">
              Observed Symptoms:
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-2 bg-[#FAF7F2] border border-[#E7E1D8] rounded">
              {COMMON_SYMPTOMS.slice(0, 10).map((sym) => {
                const isChecked = selectedSymptoms.includes(sym);
                return (
                  <button
                    type="button"
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className={`text-left px-2 py-1.5 rounded text-[11px] transition-colors border cursor-pointer ${
                      isChecked
                        ? 'bg-[#C2410C] text-white border-[#C2410C] font-semibold'
                        : 'bg-white text-[#44403C] border-[#E7E1D8] hover:bg-[#F5F0E8]'
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E7E1D8] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#F0EBE1] text-[#57534E] rounded-md text-xs font-medium border border-[#E7E1D8] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#C2410C] hover:bg-[#9A3412] active:bg-[#7C2D12] text-white rounded-md text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Submit &amp; Enqueue Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
