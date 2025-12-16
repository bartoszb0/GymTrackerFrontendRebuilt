import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { Workout } from "../../types/types";
import api from "../../utils/api";

type CreateWorkoutInput = {
  name: string;
};

export default function useCreateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkoutInput) => api.post("workouts/", data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["workouts"] });

      const previous = queryClient.getQueryData<Workout[]>(["workouts"]);

      const newWorkout = {
        id: -Date.now(),
        name: data.name,
        optimistic: true,
      };

      queryClient.setQueryData(["workouts"], [...(previous ?? []), newWorkout]);

      return { previous };
    },
    onError: (_, __, context) => {
      toast.error("Failed to create exercise");
      if (context) {
        queryClient.setQueryData(["workouts"], context.previous);
      }
    },
    onSuccess: () => {
      toast.success("Workout created");
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}
