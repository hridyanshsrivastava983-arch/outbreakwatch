/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { EntryScreen } from './components/EntryScreen';
import { HeaderNav } from './components/HeaderNav';
import { Sidebar } from './components/Sidebar';
import { SurveillanceMainView } from './components/SurveillanceMainView';
import { RegionDetailPage } from './components/RegionDetailPage';
import { GraphSpreadView } from './components/GraphSpreadView';
import { SIRSimulationView } from './components/SIRSimulationView';
import { AlertsReportsPage } from './components/AlertsReportsPage';
import { IntakePipelineView } from './components/IntakePipelineView';
import { DSABenchmarksView } from './components/DSABenchmarksView';
import { ReportModal } from './components/ReportModal';

import { CaseReport, OutbreakAlert, AlertStatus } from './types/epidemiology';
import {
  INITIAL_REGIONS,
  INITIAL_CONNECTIONS,
  generateInitialCases,
  getRecentDates,
  COMMON_DISEASES,
  COMMON_SYMPTOMS,
} from './data/initialData';

import { Queue } from './dsa/Queue';
import { HashMapIndex } from './dsa/HashMapIndex';
import { Trie } from './dsa/Trie';
import { SegmentTree } from './dsa/SegmentTree';
import { MaxHeap } from './dsa/MaxHeap';
import { RegionGraph } from './dsa/RegionGraph';
import { AnomalyDetector } from './algorithms/AnomalyDetector';

export default function App() {
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>('overview');
  const [selectedDiseaseFilter, setSelectedDiseaseFilter] = useState<string>('ALL');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('REG-03'); // Sector 3 (East Harbour & Port - Dengue hotspot)
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  // 35-Day Surveillance Window
  const dates = useMemo(() => getRecentDates(35), []);

  // Primary Data Structure Singletons
  const queueRef = useRef<Queue<CaseReport>>(new Queue<CaseReport>());
  const indexRef = useRef<HashMapIndex>(new HashMapIndex());
  const trieRef = useRef<Trie>(new Trie());
  const graphRef = useRef<RegionGraph>(new RegionGraph());
  const anomalyDetectorRef = useRef<AnomalyDetector>(new AnomalyDetector());

  // Ingested cases state
  const [cases, setCases] = useState<CaseReport[]>(() => {
    const initial = generateInitialCases();
    initial.forEach((c) => {
      indexRef.current.insert(c);
      trieRef.current.recordCoOccurrence(c.symptoms, c.disease);
    });
    return initial;
  });

  const [queueCases, setQueueCases] = useState<CaseReport[]>([]);
  const [alerts, setAlerts] = useState<OutbreakAlert[]>([]);

  // Initialize Graph and Trie on Mount
  useEffect(() => {
    INITIAL_REGIONS.forEach((r) => graphRef.current.addRegion(r));
    INITIAL_CONNECTIONS.forEach((e) => graphRef.current.addConnection(e));
    COMMON_SYMPTOMS.forEach((s) => trieRef.current.insert(s));
    COMMON_DISEASES.forEach((d) => trieRef.current.insert(d));
  }, []);

  // Recompute alerts via Anomaly Detector & Max-Heap
  const recomputeAlerts = useCallback(() => {
    const heap = new MaxHeap<OutbreakAlert>((a) => a.alertPriorityScore);

    INITIAL_REGIONS.forEach((reg) => {
      const dailyCounts = dates.map((d) => indexRef.current.getDailyCountForRegion(reg.id, d));
      const evalResult = anomalyDetectorRef.current.evaluateRegionSurge(
        dailyCounts,
        reg,
        reg.id === 'REG-03' || reg.id === 'REG-04' ? 'Dengue Fever' : 'Influenza A (H1N1)'
      );

      const regCases = indexRef.current.getByRegion(reg.id);
      const diseaseCounts: { [key: string]: number } = {};
      regCases.forEach((c) => {
        diseaseCounts[c.disease] = (diseaseCounts[c.disease] || 0) + 1;
      });
      const topDisease =
        Object.entries(diseaseCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Viral Outbreak';

      const alert = anomalyDetectorRef.current.createAlert(
        reg,
        topDisease,
        dailyCounts[dailyCounts.length - 1],
        evalResult
      );

      heap.insert(alert);
    });

    setAlerts(heap.getSortedDesc());
  }, [dates]);

  useEffect(() => {
    recomputeAlerts();
  }, [recomputeAlerts]);

  // Segment tree over chronological counts
  const segmentTree = useMemo(() => {
    const dailyAggregates = dates.map((d) => indexRef.current.getByDate(d).length);
    return new SegmentTree(dailyAggregates, dates);
  }, [dates, cases]);

  // Report ingestion handler
  const processReportIngestion = useCallback(
    (reportData: Omit<CaseReport, 'id' | 'recordedAt' | 'patientHash'>) => {
      const newId = `RPT-2026-${(cases.length + 1001).toString()}`;
      const newReport: CaseReport = {
        ...reportData,
        id: newId,
        recordedAt: Date.now(),
        patientHash: `P-${Date.now().toString(16).slice(-5).toUpperCase()}`,
      };

      queueRef.current.enqueue(newReport);
      setQueueCases(queueRef.current.toArray());

      const dequeued = queueRef.current.dequeue();
      if (dequeued) {
        indexRef.current.insert(dequeued);
        trieRef.current.recordCoOccurrence(dequeued.symptoms, dequeued.disease);
        setCases((prev) => [...prev, dequeued]);
        setQueueCases(queueRef.current.toArray());
        recomputeAlerts();
      }
    },
    [cases.length, recomputeAlerts]
  );

  const handleBatchSimulate = useCallback(
    (count: number) => {
      const today = dates[dates.length - 1];
      for (let i = 0; i < count; i++) {
        const randomReg = INITIAL_REGIONS[Math.floor(Math.random() * INITIAL_REGIONS.length)];
        const randomDisease = COMMON_DISEASES[Math.floor(Math.random() * COMMON_DISEASES.length)];
        const sampleSymptoms = [
          COMMON_SYMPTOMS[Math.floor(Math.random() * COMMON_SYMPTOMS.length)],
          COMMON_SYMPTOMS[Math.floor(Math.random() * COMMON_SYMPTOMS.length)],
        ];

        processReportIngestion({
          disease: randomDisease,
          regionId: randomReg.id,
          regionName: randomReg.name,
          date: today,
          ageGroup: (['0-17', '18-49', '50-64', '65+'] as const)[i % 4],
          symptoms: sampleSymptoms,
          severity: ((i % 5) + 1) as any,
          facility: `${randomReg.name} Field Surveillance Post`,
        });
      }
    },
    [dates, processReportIngestion]
  );

  useEffect(() => {
    let intervalId: any;
    if (isStreaming) {
      intervalId = setInterval(() => {
        handleBatchSimulate(1);
      }, 2000);
    }
    return () => clearInterval(intervalId);
  }, [isStreaming, handleBatchSimulate]);

  const handleUpdateAlertStatus = (alertId: string, status: AlertStatus) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status } : a))
    );
  };

  const activeAlertCount = alerts.filter((a) => a.severity >= 3).length;

  // View Navigation Handlers
  const handleDrillDownRegion = (regionId: string) => {
    setSelectedRegionId(regionId);
    setActiveView('regions');
  };

  // Screen 1: Entry Screen Gateway
  if (!isEntered) {
    return (
      <EntryScreen
        onEnter={(targetView) => {
          setIsEntered(true);
          if (targetView) {
            setActiveView(targetView);
          }
        }}
        sectorCount={INITIAL_REGIONS.length}
        totalRecordsCount={cases.length}
        activeSurgeCount={activeAlertCount}
      />
    );
  }

  // Screens 2 - 6: Full Multi-Page Surveillance Console
  return (
    <div className="flex h-screen bg-[#FAF7F2] text-[#1C1917] font-sans antialiased overflow-hidden select-text">
      {/* Persistent Left Navigation Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        selectedDiseaseFilter={selectedDiseaseFilter}
        setSelectedDiseaseFilter={setSelectedDiseaseFilter}
        diseases={COMMON_DISEASES}
        activeAlertCount={activeAlertCount}
        totalCasesCount={cases.length}
        onOpenIntakeModal={() => setIsReportModalOpen(true)}
        onExitToGateway={() => setIsEntered(false)}
      />

      {/* Main Operational Stage */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Executive Command Header */}
        <HeaderNav
          activeView={activeView}
          setActiveView={setActiveView}
          activeAlertCount={activeAlertCount}
          totalCasesCount={cases.length}
          isStreaming={isStreaming}
          toggleStreaming={() => setIsStreaming(!isStreaming)}
          onOpenIntakeModal={() => setIsReportModalOpen(true)}
          selectedDiseaseFilter={selectedDiseaseFilter}
          setSelectedDiseaseFilter={setSelectedDiseaseFilter}
          diseases={COMMON_DISEASES}
        />

        {/* Content View Routing */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* Screen 2: Overview Dashboard */}
          {activeView === 'overview' && (
            <SurveillanceMainView
              regions={INITIAL_REGIONS}
              connections={INITIAL_CONNECTIONS}
              alerts={alerts}
              cases={cases}
              selectedRegionId={selectedRegionId}
              setSelectedRegionId={setSelectedRegionId}
              dates={dates}
              segmentTree={segmentTree}
              onUpdateAlertStatus={handleUpdateAlertStatus}
              diseaseFilter={selectedDiseaseFilter}
              onDrillDownRegion={handleDrillDownRegion}
            />
          )}

          {/* Screen 3: Region Detail Page */}
          {activeView === 'regions' && (
            <RegionDetailPage
              regions={INITIAL_REGIONS}
              selectedRegionId={selectedRegionId}
              setSelectedRegionId={setSelectedRegionId}
              cases={cases}
              alerts={alerts}
              dates={dates}
              onNavigateClusters={() => setActiveView('clusters')}
              onNavigateForecast={() => setActiveView('forecast')}
              onUpdateAlertStatus={handleUpdateAlertStatus}
            />
          )}

          {/* Screen 4: Outbreak Clusters & Spread */}
          {activeView === 'clusters' && (
            <GraphSpreadView
              regions={INITIAL_REGIONS}
              connections={INITIAL_CONNECTIONS}
              alerts={alerts}
              graph={graphRef.current}
              selectedRegionId={selectedRegionId}
              setSelectedRegionId={setSelectedRegionId}
            />
          )}

          {/* Screen 5: SIR Transmission Forecast */}
          {activeView === 'forecast' && <SIRSimulationView />}

          {/* Screen 6: Alerts & Situation Reports */}
          {activeView === 'reports' && (
            <AlertsReportsPage
              alerts={alerts}
              regions={INITIAL_REGIONS}
              onUpdateAlertStatus={handleUpdateAlertStatus}
              onNavigateSector={handleDrillDownRegion}
            />
          )}

          {/* Auxiliary Screen: Clinical Case Intake Pipeline */}
          {activeView === 'intake' && (
            <IntakePipelineView
              regions={INITIAL_REGIONS}
              cases={cases}
              queueCases={queueCases}
              onManualSubmit={processReportIngestion}
              onBatchSimulate={handleBatchSimulate}
              isStreaming={isStreaming}
              toggleStreaming={() => setIsStreaming(!isStreaming)}
            />
          )}

          {/* Auxiliary Screen: DSA System Verification & Complexity Benchmarks */}
          {activeView === 'benchmarks' && (
            <DSABenchmarksView
              regions={INITIAL_REGIONS}
              alerts={alerts}
            />
          )}
        </main>
      </div>

      {/* Direct Report Intake Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        regions={INITIAL_REGIONS}
        onManualSubmit={processReportIngestion}
      />
    </div>
  );
}
