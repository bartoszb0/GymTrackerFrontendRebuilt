import { useSuspenseQuery } from "@tanstack/react-query";
import type { ApiExercise, Exercise } from "../../types/types";
import api from "../../utils/api";

export default function useWorkoutExercises(workoutId: number) {
  return useSuspenseQuery<Exercise[]>({
    queryKey: ["workout", workoutId],
    queryFn: () =>
      api.get(`workouts/${workoutId}/exercises/`).then((res) =>
        res.data.map((exercise: ApiExercise) => ({
          ...exercise,
          weight: parseFloat(exercise.weight), // convert to number
        }))
      ),
  });
}
