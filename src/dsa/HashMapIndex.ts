import { CaseReport } from '../types/epidemiology';

/**
 * Multi-Key Inverted Index using Hash Maps (Map<string, T>).
 * Provides O(1) average lookup times for:
 * - Cases by Unique ID
 * - Cases by Region ID
 * - Cases by Disease Name
 * - Cases by Date String (YYYY-MM-DD)
 * - Composite Key (Region + Disease)
 */
export class HashMapIndex {
  private byId = new Map<string, CaseReport>();
  private byRegion = new Map<string, string[]>(); // regionId -> array of caseIds
  private byDisease = new Map<string, string[]>(); // disease -> array of caseIds
  private byDate = new Map<string, string[]>(); // YYYY-MM-DD -> array of caseIds
  private byRegionAndDisease = new Map<string, string[]>(); // "regionId::disease" -> array of caseIds

  insert(report: CaseReport): void {
    // 1. By ID
    this.byId.set(report.id, report);

    // 2. By Region
    const regionList = this.byRegion.get(report.regionId) || [];
    regionList.push(report.id);
    this.byRegion.set(report.regionId, regionList);

    // 3. By Disease
    const diseaseList = this.byDisease.get(report.disease) || [];
    diseaseList.push(report.id);
    this.byDisease.set(report.disease, diseaseList);

    // 4. By Date
    const dateList = this.byDate.get(report.date) || [];
    dateList.push(report.id);
    this.byDate.set(report.date, dateList);

    // 5. Composite Region + Disease
    const compositeKey = `${report.regionId}::${report.disease}`;
    const compList = this.byRegionAndDisease.get(compositeKey) || [];
    compList.push(report.id);
    this.byRegionAndDisease.set(compositeKey, compList);
  }

  getById(id: string): CaseReport | undefined {
    return this.byId.get(id);
  }

  getByRegion(regionId: string): CaseReport[] {
    const ids = this.byRegion.get(regionId) || [];
    return ids.map((id) => this.byId.get(id)!).filter(Boolean);
  }

  getByDisease(disease: string): CaseReport[] {
    const ids = this.byDisease.get(disease) || [];
    return ids.map((id) => this.byId.get(id)!).filter(Boolean);
  }

  getByDate(date: string): CaseReport[] {
    const ids = this.byDate.get(date) || [];
    return ids.map((id) => this.byId.get(id)!).filter(Boolean);
  }

  getByRegionAndDisease(regionId: string, disease: string): CaseReport[] {
    const key = `${regionId}::${disease}`;
    const ids = this.byRegionAndDisease.get(key) || [];
    return ids.map((id) => this.byId.get(id)!).filter(Boolean);
  }

  getDailyCountForRegion(regionId: string, date: string): number {
    const dateIds = this.byDate.get(date) || [];
    let count = 0;
    for (const id of dateIds) {
      const report = this.byId.get(id);
      if (report && report.regionId === regionId) {
        count++;
      }
    }
    return count;
  }

  getAllCases(): CaseReport[] {
    return Array.from(this.byId.values());
  }

  getTotalCount(): number {
    return this.byId.size;
  }

  clear(): void {
    this.byId.clear();
    this.byRegion.clear();
    this.byDisease.clear();
    this.byDate.clear();
    this.byRegionAndDisease.clear();
  }
}
