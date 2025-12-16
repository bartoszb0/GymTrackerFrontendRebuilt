import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../../utils/api";

export default function useDeleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workoutId: number) => api.delete(`workouts/${workoutId}/`),
    onError: (error) => toast.error(error.message),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["workouts"] });
      toast.success("Workout deleted");
    },
  });
}
