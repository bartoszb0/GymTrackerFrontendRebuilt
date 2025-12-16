import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { Exercise } from "../../types/types";
import api from "../../utils/api";

type CreateExerciseInput = {
  name: string;
  sets: number;
  reps: number;
  weight?: number | undefined;
};

export default function useCreateExercise(workoutId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExerciseInput) =>
      api.post(`workouts/${workoutId}/exercises/`, data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["workout", workoutId] });

      const previous = queryClient.getQueryData<Exercise[]>([
        "workout",
        workoutId,
      ]);

      const optimisticExercise: Exercise = {
        id: -Date.now(), // temporary negative ID
        name: data.name,
        sets: data.sets,
        reps: data.reps,
        weight: data.weight ?? 0,
        optimistic: true,
      };

      queryClient.setQueryData(
        ["workout", workoutId],
        [...(previous ?? []), optimisticExercise]
      );

      return { previous };
    },
    onError: (_, __, context) => {
      toast.error("Failed to create exercise");
      if (context) {
        queryClient.setQueryData(["workout", workoutId], context.previous);
      }
    },
    onSuccess: () => {
      toast.success("Exercise created");
      queryClient.invalidateQueries({ queryKey: ["workout", workoutId] });
    },
  });
}
