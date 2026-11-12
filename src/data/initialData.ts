import { RegionNode, RegionEdge, CaseReport } from '../types/epidemiology';

export const INITIAL_REGIONS: RegionNode[] = [
  {
    id: 'REG-01',
    name: 'Sector 1 — Metro Central',
    code: 'SEC-01',
    population: 1420000,
    areaKm2: 185,
    density: 7675,
    coordinates: { x: 340, y: 220, lat: 28.6139, lng: 77.209 },
    baselineDailyCases: 14,
    hospitalBeds: 2800,
    healthUnits: 42,
  },
  {
    id: 'REG-02',
    name: 'Sector 2 — North Ridge Corridor',
    code: 'SEC-02',
    population: 860000,
    areaKm2: 320,
    density: 2687,
    coordinates: { x: 310, y: 90, lat: 28.7041, lng: 77.1025 },
    baselineDailyCases: 8,
    hospitalBeds: 1250,
    healthUnits: 28,
  },
  {
    id: 'REG-03',
    name: 'Sector 3 — East Harbour & Port',
    code: 'SEC-03',
    population: 1150000,
    areaKm2: 240,
    density: 4791,
    coordinates: { x: 520, y: 190, lat: 28.628, lng: 77.315 },
    baselineDailyCases: 10,
    hospitalBeds: 1600,
    healthUnits: 34,
  },
  {
    id: 'REG-04',
    name: 'Sector 4 — River Basin Wetlands',
    code: 'SEC-04',
    population: 680000,
    areaKm2: 410,
    density: 1658,
    coordinates: { x: 490, y: 320, lat: 28.5355, lng: 77.391 },
    baselineDailyCases: 6,
    hospitalBeds: 850,
    healthUnits: 20,
  },
  {
    id: 'REG-05',
    name: 'Sector 5 — South Valley Highlands',
    code: 'SEC-05',
    population: 940000,
    areaKm2: 290,
    density: 3241,
    coordinates: { x: 330, y: 380, lat: 28.4595, lng: 77.0266 },
    baselineDailyCases: 9,
    hospitalBeds: 1400,
    healthUnits: 26,
  },
  {
    id: 'REG-06',
    name: 'Sector 6 — West Industrial Park',
    code: 'SEC-06',
    population: 1020000,
    areaKm2: 210,
    density: 4857,
    coordinates: { x: 170, y: 250, lat: 28.57, lng: 76.98 },
    baselineDailyCases: 11,
    hospitalBeds: 1550,
    healthUnits: 31,
  },
  {
    id: 'REG-07',
    name: 'Sector 7 — Highland Suburbs',
    code: 'SEC-07',
    population: 520000,
    areaKm2: 380,
    density: 1368,
    coordinates: { x: 160, y: 120, lat: 28.68, lng: 76.92 },
    baselineDailyCases: 5,
    hospitalBeds: 620,
    healthUnits: 15,
  },
  {
    id: 'REG-08',
    name: 'Sector 8 — Lake District Tech Hub',
    code: 'SEC-08',
    population: 780000,
    areaKm2: 175,
    density: 4457,
    coordinates: { x: 210, y: 390, lat: 28.41, lng: 77.12 },
    baselineDailyCases: 7,
    hospitalBeds: 1100,
    healthUnits: 22,
  },
  {
    id: 'REG-09',
    name: 'Sector 9 — Southern Estuary',
    code: 'SEC-09',
    population: 620000,
    areaKm2: 310,
    density: 2000,
    coordinates: { x: 440, y: 430, lat: 28.38, lng: 77.31 },
    baselineDailyCases: 5,
    hospitalBeds: 720,
    healthUnits: 18,
  },
  {
    id: 'REG-10',
    name: 'Sector 10 — Delta Marshlands',
    code: 'SEC-10',
    population: 430000,
    areaKm2: 440,
    density: 977,
    coordinates: { x: 570, y: 380, lat: 28.42, lng: 77.46 },
    baselineDailyCases: 4,
    hospitalBeds: 480,
    healthUnits: 12,
  },
  {
    id: 'REG-11',
    name: 'Sector 11 — Foothill Colony',
    code: 'SEC-11',
    population: 580000,
    areaKm2: 390,
    density: 1487,
    coordinates: { x: 440, y: 80, lat: 28.75, lng: 77.25 },
    baselineDailyCases: 5,
    hospitalBeds: 650,
    healthUnits: 16,
  },
  {
    id: 'REG-12',
    name: 'Sector 12 — Western Rail Terminal',
    code: 'SEC-12',
    population: 890000,
    areaKm2: 195,
    density: 4564,
    coordinates: { x: 80, y: 310, lat: 28.51, lng: 76.88 },
    baselineDailyCases: 8,
    hospitalBeds: 1150,
    healthUnits: 24,
  },
];

export const INITIAL_CONNECTIONS: RegionEdge[] = [
  { from: 'REG-01', to: 'REG-02', distanceKm: 24, dailyTravelVolume: 85000, transmissionWeight: 1 },
  { from: 'REG-01', to: 'REG-03', distanceKm: 18, dailyTravelVolume: 120000, transmissionWeight: 1 },
  { from: 'REG-01', to: 'REG-05', distanceKm: 28, dailyTravelVolume: 95000, transmissionWeight: 1 },
  { from: 'REG-01', to: 'REG-06', distanceKm: 22, dailyTravelVolume: 110000, transmissionWeight: 1 },
  { from: 'REG-02', to: 'REG-07', distanceKm: 32, dailyTravelVolume: 35000, transmissionWeight: 1 },
  { from: 'REG-02', to: 'REG-11', distanceKm: 21, dailyTravelVolume: 42000, transmissionWeight: 1 },
  { from: 'REG-03', to: 'REG-04', distanceKm: 26, dailyTravelVolume: 72000, transmissionWeight: 1 },
  { from: 'REG-03', to: 'REG-11', distanceKm: 29, dailyTravelVolume: 51000, transmissionWeight: 1 },
  { from: 'REG-04', to: 'REG-05', distanceKm: 35, dailyTravelVolume: 42000, transmissionWeight: 1 },
  { from: 'REG-04', to: 'REG-10', distanceKm: 19, dailyTravelVolume: 38000, transmissionWeight: 1 },
  { from: 'REG-05', to: 'REG-08', distanceKm: 21, dailyTravelVolume: 64000, transmissionWeight: 1 },
  { from: 'REG-05', to: 'REG-09', distanceKm: 27, dailyTravelVolume: 45000, transmissionWeight: 1 },
  { from: 'REG-06', to: 'REG-07', distanceKm: 29, dailyTravelVolume: 48000, transmissionWeight: 1 },
  { from: 'REG-06', to: 'REG-08', distanceKm: 31, dailyTravelVolume: 51000, transmissionWeight: 1 },
  { from: 'REG-06', to: 'REG-12', distanceKm: 23, dailyTravelVolume: 88000, transmissionWeight: 1 },
  { from: 'REG-08', to: 'REG-09', distanceKm: 34, dailyTravelVolume: 32000, transmissionWeight: 1 },
  { from: 'REG-09', to: 'REG-10', distanceKm: 25, dailyTravelVolume: 29000, transmissionWeight: 1 },
];

export const COMMON_DISEASES = [
  'Dengue Fever',
  'Influenza A (H1N1)',
  'Cholera (Vibrio cholerae)',
  'Measles (Rubeola)',
  'Typhoid Fever',
];

export const COMMON_SYMPTOMS = [
  'High fever',
  'Retro-orbital pain',
  'Severe joint pain',
  'Petechial rash',
  'Platelet drop',
  'Nausea and vomiting',
  'Dry cough',
  'Sore throat',
  'Shortness of breath',
  'Loss of smell or taste (anosmia)',
  'Profuse rice-water diarrhea',
  'Rapid dehydration',
  'Severe leg cramps',
  'Cyclical high fever with shaking chills',
  'Profuse sweating',
  'Malaise and fatigue',
  'Step-ladder prolonged fever',
  'Abdominal tenderness',
  'Koplik spots on buccal mucosa',
  'Maculopapular rash',
];

export function getRecentDates(count: number = 35): string[] {
  const dates: string[] = [];
  const now = new Date('2026-11-11T12:00:00Z');
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export function generateInitialCases(): CaseReport[] {
  const dates = getRecentDates(35);
  const cases: CaseReport[] = [];
  let idCounter = 1000;

  dates.forEach((dateStr, dayIndex) => {
    INITIAL_REGIONS.forEach((reg) => {
      let count = Math.max(1, Math.round(reg.baselineDailyCases * (0.8 + Math.random() * 0.4)));

      // Outbreak surge: Sector 3 & Sector 4 in last 12 days (Dengue Outbreak Cluster)
      if ((reg.id === 'REG-03' || reg.id === 'REG-04') && dayIndex >= 22) {
        const surgeFactor = 1 + (dayIndex - 22) * 0.45;
        count = Math.round(reg.baselineDailyCases * surgeFactor);
      }

      // Respiratory surge: Sector 1 (Metro Central) in last 5 days (Influenza A)
      if (reg.id === 'REG-01' && dayIndex >= 30) {
        count = Math.round(reg.baselineDailyCases * 2.5);
      }

      // Waterborne enteric surge: Sector 9 & Sector 10 in last 8 days (Cholera)
      if ((reg.id === 'REG-09' || reg.id === 'REG-10') && dayIndex >= 26) {
        count = Math.round(reg.baselineDailyCases * 2.8);
      }

      for (let c = 0; c < count; c++) {
        idCounter++;
        let disease = COMMON_DISEASES[idCounter % COMMON_DISEASES.length];
        let symptoms = ['High fever', 'Malaise and fatigue'];
        let severity: 1 | 2 | 3 | 4 | 5 = ((idCounter % 5) + 1) as any;

        if (reg.id === 'REG-03' || reg.id === 'REG-04') {
          disease = 'Dengue Fever';
          symptoms = ['High fever', 'Retro-orbital pain', 'Severe joint pain', 'Petechial rash'];
          severity = dayIndex >= 28 ? 4 : 3;
        } else if (reg.id === 'REG-01') {
          disease = 'Influenza A (H1N1)';
          symptoms = ['High fever', 'Dry cough', 'Sore throat', 'Malaise and fatigue'];
          severity = 3;
        } else if (reg.id === 'REG-09' || reg.id === 'REG-10') {
          disease = 'Cholera (Vibrio cholerae)';
          symptoms = ['Profuse rice-water diarrhea', 'Rapid dehydration', 'Severe leg cramps'];
          severity = dayIndex >= 30 ? 5 : 4;
        }

        cases.push({
          id: `RPT-2026-${idCounter}`,
          disease,
          regionId: reg.id,
          regionName: reg.name,
          date: dateStr,
          ageGroup: (['0-17', '18-49', '50-64', '65+'] as const)[idCounter % 4],
          symptoms,
          severity,
          recordedAt: new Date(`${dateStr}T10:00:00Z`).getTime() + c * 180000,
          facility: `${reg.name} Epidemiological Sentinel Unit`,
          patientHash: `P-${idCounter.toString(16).toUpperCase()}`,
        });
      }
    });
  });

  return cases;
}
