export type Workout = {
  id: number;
  name: string;
  owner: number;
};

export type Exercise = {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: string;
};
