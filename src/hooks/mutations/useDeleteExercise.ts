import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { Exercise } from "../../types/types";
import api from "../../utils/api";

export default function useDeleteExercise(
  workoutId: number,
  exerciseId: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.delete(`workouts/${workoutId}/exercises/${exerciseId}/`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["workout", workoutId] });
      const previous = queryClient.getQueryData<Exercise[]>([
        "workout",
        workoutId,
      ]);

      const updatedExercises = (previous ?? []).map((oldExercise) =>
        oldExercise.id === exerciseId
          ? { ...oldExercise, optimistic: true }
          : oldExercise
      );

      queryClient.setQueryData(["workout", workoutId], updatedExercises);

      return { previous };
    },
    onError: (_, __, context) => {
      if (context) {
        queryClient.setQueryData(["workout", workoutId], context.previous);
      }
    },
    onSuccess: () => {
      queryClient.setQueryData<Exercise[]>(["workout", workoutId], (previous) =>
        previous?.filter((exercise) => exercise.id !== exerciseId)
      );
      toast.success("Exercise deleted");
    },
  });
}
