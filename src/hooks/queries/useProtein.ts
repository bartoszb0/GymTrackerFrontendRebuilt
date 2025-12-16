import { useSuspenseQuery } from "@tanstack/react-query";
import type { ProteinInfo } from "../../types/types";
import api from "../../utils/api";

export default function useProtein() {
  return useSuspenseQuery<ProteinInfo>({
    queryKey: ["protein"],
    queryFn: () => api.get("protein/").then((res) => res.data),
  });
}
