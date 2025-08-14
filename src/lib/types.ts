// src/lib/types.ts
export interface ContextRow {
  survey: string;
  site?: string;
  code: string;
  label: string;
  value: string | number;
}

export interface RatingsDims {
  helpfulness: number; // 0..5
  honesty: number;     // 0..5
  harmlessness: number;// 0..5
}

export interface Section {
  id: string;
  title: string;
  cluster: string;
  aiText: string;
  humanText: string;
  rating: number;        // overall (avg of dims)
  ratings: RatingsDims;  // per-dimension scores
  accepted: boolean;
  hasRecs: boolean;
  aiRecs: string[];
  humanRecs: string[];
  acceptRecs: boolean;
  narrativeFields: string[];
  recFields: string[];
  chart: "none" | "bar" | "pie";
  chartData: any[];
  contextRows: ContextRow[];
}
