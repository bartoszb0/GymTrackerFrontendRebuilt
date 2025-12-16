import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { Exercise } from "../../types/types";
import api from "../../utils/api";

type UpdateExerciseInput = {
  reps?: number | undefined;
  weight?: number | undefined;
};

export default function useUpdateExercise(
  workoutId: number,
  exercise: Exercise
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateExerciseInput) =>
      api
        .patch(`/workouts/${workoutId}/exercises/${exercise.id}/`, data)
        .then((res) => res.data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["workout", workoutId] });
      const previous = queryClient.getQueryData<Exercise[]>([
        "workout",
        workoutId,
      ]);

      const updatedExercises = (previous ?? []).map((oldExercise) =>
        oldExercise.id === exercise.id
          ? {
              ...oldExercise,
              reps: data.reps ?? oldExercise.reps,
              weight: data.weight ?? oldExercise.weight,
              optimistic: true,
            }
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
      queryClient.invalidateQueries({ queryKey: ["workout", workoutId] });
      toast.success("Changes saved");
    },
  });
}
