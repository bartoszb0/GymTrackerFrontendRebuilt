export type Workout = {
  id: number;
  name: string;
  owner: number;
  optimistic?: boolean;
};

export type Exercise = {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: string | number;
  optimistic?: boolean;
};

export type ProteinInfo = {
  todays_protein: number;
  protein_goal: number;
};
