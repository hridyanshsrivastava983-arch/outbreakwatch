import { MaxHeap } from '../dsa/MaxHeap';
import { RegionNode, OutbreakAlert, ResourceAllocation } from '../types/epidemiology';

export interface ResourcePool {
  totalTestKitsAvailable: number;
  totalVaccineDosesAvailable: number;
  totalRapidResponseUnitsAvailable: number;
}

/**
 * Greedy / Priority-Queue based Resource Allocation Engine.
 * Implements Planned Enhancement #6 from Review 2:
 * "Resource-allocation suggestion: a simple greedy/priority-queue based allocator
 * suggesting test-kit/vaccine distribution by alert score."
 */
export class ResourceAllocator {
  /**
   * Distributes medical resources proportionally to urgency score
   * prioritized using a MaxHeap.
   */
  static allocateResources(
    regions: RegionNode[],
    alerts: OutbreakAlert[],
    pool: ResourcePool
  ): ResourceAllocation[] {
    const alertMap = new Map<string, OutbreakAlert>();
    for (const a of alerts) {
      alertMap.set(a.regionId, a);
    }

    // Rank regions using MaxHeap based on Risk Score
    interface RegionRiskItem {
      region: RegionNode;
      riskScore: number;
      alert?: OutbreakAlert;
    }

    const heap = new MaxHeap<RegionRiskItem>((item) => item.riskScore);

    for (const reg of regions) {
      const alert = alertMap.get(reg.id);
      const riskScore = alert ? alert.alertPriorityScore : 10.0;
      heap.insert({
        region: reg,
        riskScore,
        alert,
      });
    }

    const prioritizedRegions = heap.getSortedDesc();
    const totalRiskWeight = prioritizedRegions.reduce(
      (sum, item) => sum + Math.max(1, item.riskScore),
      0
    );

    let remainingKits = pool.totalTestKitsAvailable;
    let remainingVaccines = pool.totalVaccineDosesAvailable;
    let remainingTeams = pool.totalRapidResponseUnitsAvailable;

    const allocations: ResourceAllocation[] = [];

    prioritizedRegions.forEach((item, index) => {
      const weightFraction = Math.max(0.02, item.riskScore / totalRiskWeight);

      // Higher tier allocations for top-ranked regions
      let allocatedKits = Math.min(
        remainingKits,
        Math.round(pool.totalTestKitsAvailable * weightFraction)
      );
      let allocatedVaccines = Math.min(
        remainingVaccines,
        Math.round(pool.totalVaccineDosesAvailable * weightFraction)
      );
      let allocatedTeams = 0;

      if (item.riskScore >= 40 && remainingTeams > 0) {
        allocatedTeams = Math.min(remainingTeams, Math.ceil(item.riskScore / 25));
        remainingTeams -= allocatedTeams;
      }

      remainingKits -= allocatedKits;
      remainingVaccines -= allocatedVaccines;

      allocations.push({
        regionId: item.region.id,
        regionName: item.region.name,
        riskScore: item.riskScore,
        recommendedTestKits: allocatedKits,
        recommendedVaccines: allocatedVaccines,
        recommendedResponseUnits: allocatedTeams,
        priorityRank: index + 1,
      });
    });

    return allocations;
  }
}
