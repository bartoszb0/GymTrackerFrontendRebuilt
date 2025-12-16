import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ProteinInfo } from "../../types/types";
import api from "../../utils/api";

type ChangeProteinGoalInput = {
  protein_goal: number;
};

export default function useChangeProteinGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeProteinGoalInput) => api.patch("protein/", data),

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["protein"] });

      const previous = queryClient.getQueryData<ProteinInfo>(["protein"]);

      queryClient.setQueryData(["protein"], {
        ...previous,
        protein_goal: data.protein_goal,
      });

      return { previous };
    },

    onError: (_, __, context) => {
      toast.error("Failed to change protein goal");
      if (context) {
        queryClient.setQueryData(["protein"], context.previous);
      }
    },

    onSuccess: () => {
      toast.success("Protein goal changed");
      queryClient.invalidateQueries({ queryKey: ["protein"] });
    },
  });
}
