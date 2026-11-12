import { SymptomClassificationResult } from '../types/epidemiology';

export interface DiseaseProfile {
  name: string;
  category: string;
  priorProbability: number;
  symptomsLikelihood: { [symptom: string]: number }; // P(symptom | disease)
  urgentPrecautions: string[];
}

/**
 * Probabilistic Symptom-based Disease Classifier using Naive Bayes & kNN logic.
 * Computes posterior probabilities: P(Disease | Symptoms) ∝ P(Disease) * ∏ P(s_i | Disease)
 */
export class SymptomClassifier {
  private diseaseProfiles: DiseaseProfile[] = [
    {
      name: 'Dengue Fever',
      category: 'Vector-borne Arbovirus',
      priorProbability: 0.18,
      symptomsLikelihood: {
        'high fever': 0.95,
        'retro-orbital pain': 0.88,
        'severe joint pain': 0.92,
        'petechial rash': 0.75,
        'platelet drop': 0.85,
        'nausea and vomiting': 0.65,
        headache: 0.8,
        fatigue: 0.78,
      },
      urgentPrecautions: [
        'Monitor platelet count twice daily; avoid NSAIDs (aspirin, ibuprofen) to prevent bleeding risk.',
        'Immediate IV rehydration and vector control / mosquito netting in patient ward.',
      ],
    },
    {
      name: 'Influenza A (H1N1 / Seasonal)',
      category: 'Respiratory Viral',
      priorProbability: 0.25,
      symptomsLikelihood: {
        'high fever': 0.88,
        'dry cough': 0.9,
        'sore throat': 0.82,
        'nasal congestion': 0.8,
        'muscle ache / myalgia': 0.85,
        chills: 0.8,
        headache: 0.75,
        fatigue: 0.88,
      },
      urgentPrecautions: [
        'Respiratory droplet isolation; early antiviral (Oseltamivir) within 48 hours for high-risk patients.',
        'Distribute surgical masks and initiate contact tracing within household contacts.',
      ],
    },
    {
      name: 'COVID-19 (SARS-CoV-2)',
      category: 'Respiratory Coronavirus',
      priorProbability: 0.2,
      symptomsLikelihood: {
        'loss of smell or taste (anosmia)': 0.78,
        'dry cough': 0.85,
        'fever': 0.82,
        'shortness of breath': 0.72,
        'fatigue': 0.84,
        'sore throat': 0.7,
        'headache': 0.68,
      },
      urgentPrecautions: [
        'Immediate RT-PCR / rapid antigen confirmation test; airborne isolation in negative pressure room.',
        'Continuous pulse oximetry monitoring (SpO2 < 94% triggers oxygen therapy).',
      ],
    },
    {
      name: 'Cholera (Vibrio cholerae)',
      category: 'Water-borne Enteric',
      priorProbability: 0.08,
      symptomsLikelihood: {
        'profuse rice-water diarrhea': 0.98,
        'rapid dehydration': 0.94,
        'severe leg cramps': 0.85,
        'sunken eyes': 0.88,
        'nausea and vomiting': 0.82,
        'low blood pressure': 0.8,
      },
      urgentPrecautions: [
        'Aggressive oral rehydration salts (ORS) and Ringer lactate IV therapy; test water supply point.',
        'Chlorinate local municipal well / water tanks immediately; notify district sanitation officer.',
      ],
    },
    {
      name: 'Malaria (Plasmodium falciparum)',
      category: 'Parasitic Vector-borne',
      priorProbability: 0.14,
      symptomsLikelihood: {
        'cyclical high fever with shaking chills': 0.96,
        'profuse sweating': 0.92,
        'severe headache': 0.82,
        'anemia': 0.78,
        'jaundice': 0.65,
        'splenomegaly': 0.7,
        'vomiting': 0.6,
      },
      urgentPrecautions: [
        'Rapid diagnostic test (RDT) or thick/thin blood smear examination immediately.',
        'Start Artemisinin-based combination therapy (ACT); screen for G6PD before Primaquine.',
      ],
    },
    {
      name: 'Typhoid Fever (Salmonella Typhi)',
      category: 'Bacterial Enteric',
      priorProbability: 0.1,
      symptomsLikelihood: {
        'step-ladder prolonged fever': 0.92,
        'rose spots on abdomen': 0.68,
        'bradycardia (faget sign)': 0.72,
        'abdominal tenderness': 0.8,
        'constipation or pea-soup diarrhea': 0.75,
        'malaise and weakness': 0.85,
      },
      urgentPrecautions: [
        'Blood culture or Widal/TyphiDot serology; initiate third-generation cephalosporins.',
        'Enforce strict food handler screening and hygiene quarantine.',
      ],
    },
    {
      name: 'Measles (Rubeola)',
      category: 'Acute Viral Exanthem',
      priorProbability: 0.05,
      symptomsLikelihood: {
        'koplik spots on buccal mucosa': 0.95,
        'maculopapular rash spreading face down': 0.94,
        'high fever': 0.9,
        'cough': 0.85,
        'coryza (runny nose)': 0.88,
        'conjunctivitis': 0.86,
      },
      urgentPrecautions: [
        'Airborne transmission precautions; provide high-dose Vitamin A therapy for pediatric cases.',
        'Ring vaccination campaign targeting unvaccinated children in surrounding 1 km radius.',
      ],
    },
  ];

  getAllSymptoms(): string[] {
    const symptomSet = new Set<string>();
    for (const profile of this.diseaseProfiles) {
      for (const s of Object.keys(profile.symptomsLikelihood)) {
        symptomSet.add(s);
      }
    }
    return Array.from(symptomSet).sort();
  }

  /**
   * Classify diseases given an array of observed symptoms using Naive Bayes log-likelihood
   */
  classify(observedSymptoms: string[]): SymptomClassificationResult[] {
    if (observedSymptoms.length === 0) return [];

    const normalizedObserved = observedSymptoms.map((s) => s.trim().toLowerCase());
    const scores: Array<{
      profile: DiseaseProfile;
      matchedSymptoms: string[];
      logScore: number;
    }> = [];

    const epsilon = 0.02; // Laplace smoothing floor

    for (const profile of this.diseaseProfiles) {
      let logScore = Math.log(profile.priorProbability);
      const matched: string[] = [];

      for (const symptom of normalizedObserved) {
        // Find best match in profile
        let matchProb = epsilon;
        for (const [profSymptom, prob] of Object.entries(profile.symptomsLikelihood)) {
          if (
            profSymptom.includes(symptom) ||
            symptom.includes(profSymptom) ||
            this.fuzzyMatch(symptom, profSymptom)
          ) {
            matchProb = prob;
            matched.push(profSymptom);
            break;
          }
        }

        logScore += Math.log(matchProb);
      }

      scores.push({
        profile,
        matchedSymptoms: Array.from(new Set(matched)),
        logScore,
      });
    }

    // Softmax normalization over exponentiated log-scores for calibrated probabilities
    const maxLog = Math.max(...scores.map((s) => s.logScore));
    const expScores = scores.map((s) => ({
      ...s,
      expVal: Math.exp(s.logScore - maxLog),
    }));

    const sumExp = expScores.reduce((acc, curr) => acc + curr.expVal, 0);

    const results: SymptomClassificationResult[] = expScores.map((s) => {
      const prob = sumExp > 0 ? s.expVal / sumExp : 0;
      return {
        disease: s.profile.name,
        confidencePct: Number((prob * 100).toFixed(1)),
        matchedSymptoms: s.matchedSymptoms,
        totalDiseaseSymptoms: Object.keys(s.profile.symptomsLikelihood).length,
        priorProb: s.profile.priorProbability,
        urgentPrecautions: s.profile.urgentPrecautions,
      };
    });

    return results.sort((a, b) => b.confidencePct - a.confidencePct);
  }

  private fuzzyMatch(a: string, b: string): boolean {
    const wordsA = a.split(' ');
    const wordsB = b.split(' ');
    return wordsA.some((w) => w.length > 3 && wordsB.some((wb) => wb.includes(w)));
  }
}
