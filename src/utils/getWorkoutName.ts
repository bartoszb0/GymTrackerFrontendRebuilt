import { useQueryClient } from "@tanstack/react-query";
import type { Workout } from "../types/types";

export default function getWorkoutName(safeId: number) {
  const queryClient = useQueryClient();
  const workouts = queryClient.getQueryData<Workout[]>(["workouts"]);
  const workoutFromCache = workouts?.find((w) => w.id === safeId);
  const workoutName = workoutFromCache?.name || "Workout";

  return workoutName;
}
