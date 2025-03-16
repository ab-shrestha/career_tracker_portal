
export interface Company {
  id: string;
  name: string;
  affinity: "Y" | "N";
  motivation: number; // 0-4
  posting: number; // 0-2
  strengths: number; // 0-4
  values: number; // 0-4
  score: number; // Sum of numerical values + 4 if affinity is Y
}
