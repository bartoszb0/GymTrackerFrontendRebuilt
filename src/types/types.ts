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
  weight: number;
  optimistic?: boolean;
};

export type ApiExercise = {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: string;
};

export type ProteinInfo = {
  todays_protein: number;
  protein_goal: number;
};
