import React, { useState } from 'react';
import { SymptomClassifier } from '../algorithms/SymptomClassifier';
import { Trie } from '../dsa/Trie';
import { COMMON_SYMPTOMS } from '../data/initialData';

interface SymptomClassifierViewProps {
  classifier: SymptomClassifier;
  trie: Trie;
}

export const SymptomClassifierView: React.FC<SymptomClassifierViewProps> = ({
  classifier,
  trie,
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'High fever',
    'Severe joint pain',
    'Retro-orbital pain',
  ]);
  const [prefixInput, setPrefixInput] = useState<string>('');
  const [minedFocusSymptom, setMinedFocusSymptom] = useState<string>('High fever');

  // Trie prefix search results
  const trieSearchResults = prefixInput.trim().length > 0
    ? trie.searchPrefix(prefixInput)
    : [];

  // Classification Results via Naive Bayes
  const classificationResults = classifier.classify(selectedSymptoms);

  // Symptom co-occurrence mining via Trie
  const coOccurrences = trie.getMinedCoOccurrences(minedFocusSymptom);

  const addSymptom = (sym: string) => {
    if (!selectedSymptoms.includes(sym)) {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const removeSymptom = (sym: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
          <span>Clinical Diagnostic Decision Support</span>
          <span>·</span>
          <span>Trie Prefix Lookup + Naive Bayes Classifier</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Symptom-Based Disease Classifier &amp; Trie Search
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Evaluates clinical presentation using <strong>Naive Bayes log-likelihood</strong> across candidate pathogens.
          Leverages a <strong>Trie (Prefix Tree)</strong> for instant sub-millisecond symptom query and co-occurrence pattern mining.
        </p>
      </div>

      {/* Main Grid: Selector & Trie on Left, Probabilities on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Symptom Input & Trie Autocomplete (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Trie Prefix Search Box */}
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Trie Prefix Autocomplete
              </h2>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                O(L) Prefix Search
              </span>
            </div>

            <div className="relative mb-3">
              <input
                type="text"
                value={prefixInput}
                onChange={(e) => setPrefixInput(e.target.value)}
                placeholder="Type symptom prefix (e.g., 'fev', 'rash', 'cough')..."
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            {/* Trie search matches */}
            {trieSearchResults.length > 0 && (
              <div className="mb-3 max-h-40 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded p-1 bg-white">
                {trieSearchResults.map((res) => (
                  <div
                    key={res.word}
                    className="flex items-center justify-between p-1.5 text-xs hover:bg-slate-50 cursor-pointer"
                    onClick={() => {
                      addSymptom(res.word);
                      setPrefixInput('');
                    }}
                  >
                    <div>
                      <span className="font-semibold text-slate-800 capitalize">
                        {res.word}
                      </span>
                      {res.associatedDiseases.length > 0 && (
                        <span className="text-[10px] text-slate-400 ml-2">
                          ({res.associatedDiseases[0]})
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      + Add
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Currently Active Observed Symptoms */}
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-2">
                Active Symptoms in Diagnostic Vector ({selectedSymptoms.length}):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedSymptoms.map((sym) => (
                  <span
                    key={sym}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium"
                  >
                    {sym}
                    <button
                      onClick={() => removeSymptom(sym)}
                      className="text-blue-500 hover:text-blue-900 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedSymptoms.length === 0 && (
                  <span className="text-xs text-slate-400 italic">
                    Select symptoms below or type in the Trie box.
                  </span>
                )}
              </div>
            </div>

            {/* Quick-Pick Symptoms Palette */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="text-[11px] font-mono uppercase text-slate-500 mb-2">
                Clinical Quick Select:
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                {COMMON_SYMPTOMS.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      onClick={() => (isSelected ? removeSymptom(sym) : addSymptom(sym))}
                      className={`text-xs px-2 py-1 rounded border transition-colors ${
                        isSelected
                          ? 'bg-slate-800 text-white border-slate-800 font-medium'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Planned Enhancement #3: Symptom Co-occurrence Mining Box */}
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Symptom Co-Occurrence Mining
              </h2>
              <span className="text-[10px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                Trie Graph Mining
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Surfaces symptom syndromic clusters frequently co-occurring in confirmed epidemiological intakes.
            </p>

            <div className="mb-3">
              <label className="text-xs font-mono text-slate-500 block mb-1">
                Pivot Symptom:
              </label>
              <select
                value={minedFocusSymptom}
                onChange={(e) => setMinedFocusSymptom(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded p-1.5 text-slate-800"
              >
                {COMMON_SYMPTOMS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              {coOccurrences.slice(0, 5).map((co, i) => (
                <div
                  key={co.symptom}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100"
                >
                  <span className="text-slate-800 capitalize">
                    {i + 1}. {co.symptom}
                  </span>
                  <span className="text-purple-700 font-bold">
                    {co.count} co-occurrences
                  </span>
                </div>
              ))}
              {coOccurrences.length === 0 && (
                <div className="text-xs text-slate-500 py-2">
                  No co-occurrence pairs logged yet for this symptom.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Naive Bayes Probability Rankings & Precautions (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Probabilistic Classifier Predictions
              </h2>
              <div className="text-xs text-slate-500">
                P(Disease | Symptoms) via Naive Bayes conditional likelihood
              </div>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
              Calibrated Probabilities
            </span>
          </div>

          <div className="space-y-4">
            {classificationResults.map((result, idx) => {
              const isTop = idx === 0 && result.confidencePct >= 35;
              return (
                <div
                  key={result.disease}
                  className={`p-4 rounded-lg border transition-all ${
                    isTop
                      ? 'border-blue-500 bg-blue-50/30 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {result.disease}
                        </span>
                        {isTop && (
                          <span className="text-[10px] font-mono bg-blue-600 text-white px-2 py-0.2 rounded font-semibold">
                            Primary Match
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Matched: {result.matchedSymptoms.length} of {result.totalDiseaseSymptoms} cardinal signs
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold font-mono tabular-nums text-blue-700">
                        {result.confidencePct}%
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Posterior Prob
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full ${
                        isTop ? 'bg-blue-600' : 'bg-slate-400'
                      }`}
                      style={{ width: `${result.confidencePct}%` }}
                    />
                  </div>

                  {/* Urgent Clinical Precautions */}
                  {result.confidencePct >= 20 && (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                      <div className="font-mono text-[10px] uppercase font-bold text-slate-600">
                        Immediate Public Health Response Protocol:
                      </div>
                      {result.urgentPrecautions.map((prec, pIdx) => (
                        <div key={pIdx} className="text-slate-700 text-[11px] flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">›</span>
                          <span>{prec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {classificationResults.length === 0 && (
              <div className="text-xs text-slate-500 text-center py-10">
                Please add symptoms to run the classifier.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
