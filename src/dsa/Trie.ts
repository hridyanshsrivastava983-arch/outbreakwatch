/**
 * Trie (Prefix Tree) node structure for fast symptom & disease lookup
 * and symptom co-occurrence tracking.
 */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
  associatedDiseases: Set<string> = new Set();
  frequency: number = 0;
  coOccurringSymptoms: Map<string, number> = new Map(); // symptom -> frequency of appearing together
}

export class Trie {
  private root: TrieNode = new TrieNode();

  /**
   * Inserts a word (symptom or disease term) along with disease association
   */
  insert(word: string, disease?: string): void {
    const normalized = word.trim().toLowerCase();
    let current = this.root;

    for (const char of normalized) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }

    current.isEndOfWord = true;
    current.frequency++;
    if (disease) {
      current.associatedDiseases.add(disease);
    }
  }

  /**
   * Records a set of co-occurring symptoms from a confirmed case report.
   * This implements the "Symptom co-occurrence mining" feature from the report.
   */
  recordCoOccurrence(symptoms: string[], disease: string): void {
    const normalized = symptoms.map((s) => s.trim().toLowerCase());

    for (let i = 0; i < normalized.length; i++) {
      const s1 = normalized[i];
      this.insert(s1, disease);

      // Find node for s1 and track co-occurrence with s2
      let node = this.getNode(s1);
      if (node) {
        for (let j = 0; j < normalized.length; j++) {
          if (i !== j) {
            const s2 = normalized[j];
            const currentCount = node.coOccurringSymptoms.get(s2) || 0;
            node.coOccurringSymptoms.set(s2, currentCount + 1);
          }
        }
      }
    }
  }

  private getNode(word: string): TrieNode | null {
    let current = this.root;
    for (const char of word) {
      if (!current.children.has(char)) {
        return null;
      }
      current = current.children.get(char)!;
    }
    return current;
  }

  /**
   * Fast prefix search: returns all words matching the prefix
   */
  searchPrefix(prefix: string): Array<{
    word: string;
    frequency: number;
    associatedDiseases: string[];
  }> {
    const normalized = prefix.trim().toLowerCase();
    let current = this.root;

    for (const char of normalized) {
      if (!current.children.has(char)) {
        return [];
      }
      current = current.children.get(char)!;
    }

    const results: Array<{
      word: string;
      frequency: number;
      associatedDiseases: string[];
    }> = [];

    this.collectWords(current, normalized, results);
    return results.sort((a, b) => b.frequency - a.frequency);
  }

  private collectWords(
    node: TrieNode,
    currentPrefix: string,
    results: Array<{
      word: string;
      frequency: number;
      associatedDiseases: string[];
    }>
  ): void {
    if (node.isEndOfWord) {
      results.push({
        word: currentPrefix,
        frequency: node.frequency,
        associatedDiseases: Array.from(node.associatedDiseases),
      });
    }

    for (const [char, childNode] of node.children.entries()) {
      this.collectWords(childNode, currentPrefix + char, results);
    }
  }

  /**
   * Returns mined co-occurring symptoms for a given symptom
   */
  getMinedCoOccurrences(symptom: string): Array<{ symptom: string; count: number }> {
    const node = this.getNode(symptom.trim().toLowerCase());
    if (!node) return [];

    const list: Array<{ symptom: string; count: number }> = [];
    for (const [s, count] of node.coOccurringSymptoms.entries()) {
      list.push({ symptom: s, count });
    }
    return list.sort((a, b) => b.count - a.count);
  }
}
