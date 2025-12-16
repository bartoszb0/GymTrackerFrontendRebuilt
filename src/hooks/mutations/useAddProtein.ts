import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ProteinInfo } from "../../types/types";
import api from "../../utils/api";

type AddProteinInput = {
  protein_to_add: number;
};

export default function useAddProtein() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddProteinInput) => api.patch("protein/", data),

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["protein"] });

      const previous = queryClient.getQueryData<ProteinInfo>(["protein"]);

      queryClient.setQueryData(["protein"], {
        ...previous,
        todays_protein:
          (previous ? previous.todays_protein : 0) + data.protein_to_add,
      });

      return { previous };
    },

    onError: (_, __, context) => {
      toast.error("Failed to add protein");
      if (context) {
        queryClient.setQueryData(["protein"], context.previous);
      }
    },

    onSuccess: () => {
      toast.success("Protein added");
      queryClient.invalidateQueries({ queryKey: ["protein"] });
    },
  });
}
