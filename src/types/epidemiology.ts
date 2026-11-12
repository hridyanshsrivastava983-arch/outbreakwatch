export type AgeGroup = '0-17' | '18-49' | '50-64' | '65+';
export type SeverityLevel = 1 | 2 | 3 | 4 | 5;
export type AlertStatus = 'ACTIVE' | 'INVESTIGATING' | 'CONTAINED';

export interface CaseReport {
  id: string;
  disease: string;
  regionId: string;
  regionName: string;
  date: string; // YYYY-MM-DD
  ageGroup: AgeGroup;
  symptoms: string[];
  severity: SeverityLevel;
  recordedAt: number;
  facility: string;
  patientHash: string;
}

export interface RegionNode {
  id: string;
  name: string;
  code: string;
  population: number;
  areaKm2: number;
  density: number; // people per km²
  coordinates: { x: number; y: number; lat: number; lng: number };
  baselineDailyCases: number;
  hospitalBeds: number;
  healthUnits: number;
}

export interface RegionEdge {
  from: string;
  to: string;
  distanceKm: number;
  dailyTravelVolume: number; // Daily commuters/transit volume
  transmissionWeight: number; // Computed metric for Dijkstra
}

export interface OutbreakAlert {
  id: string;
  regionId: string;
  regionName: string;
  disease: string;
  severity: SeverityLevel;
  zScore: number;
  currentCount: number;
  baselineCount: number;
  movingAverage7d: number;
  growthRatePct: number;
  daysUntilThresholdBreach: number;
  alertPriorityScore: number; // Used for Max-Heap ranking
  status: AlertStatus;
  detectedAt: string;
  actionRecommendation: string;
}

export interface ClusterInfo {
  clusterId: number;
  clusterName: string;
  rootRegionId: string;
  regions: RegionNode[];
  totalActiveCases: number;
  dominantDisease: string;
  outbreakStatus: 'CRITICAL_SURGE' | 'ELEVATED' | 'STABLE';
}

export interface SIRParameters {
  N: number; // Total population
  I0: number; // Initial infected
  R0: number; // Initial recovered
  beta: number; // Transmission rate (contacts * prob)
  gamma: number; // Recovery rate (1 / days infectious)
  days: number; // Simulation duration
}

export interface SIRDataPoint {
  day: number;
  susceptible: number;
  infected: number;
  recovered: number;
  dailyNewInfections: number;
  effectiveR0: number;
}

export interface SymptomClassificationResult {
  disease: string;
  confidencePct: number;
  matchedSymptoms: string[];
  totalDiseaseSymptoms: number;
  priorProb: number;
  urgentPrecautions: string[];
}

export interface ResourceAllocation {
  regionId: string;
  regionName: string;
  riskScore: number;
  recommendedTestKits: number;
  recommendedVaccines: number;
  recommendedResponseUnits: number;
  priorityRank: number;
}

export interface BenchmarkMetrics {
  operation: string;
  datasetSize: number;
  linearScanUs: number; // microseconds
  indexedUs: number; // microseconds
  speedup: number;
  theoreticalBigO: {
    linear: string;
    indexed: string;
  };
}
