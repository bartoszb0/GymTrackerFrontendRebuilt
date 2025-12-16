import { useSuspenseQuery } from "@tanstack/react-query";
import type { Workout } from "../../types/types";
import api from "../../utils/api";

export default function useWorkouts() {
  return useSuspenseQuery<Workout[]>({
    queryKey: ["workouts"],
    queryFn: () => api.get("workouts/").then((res) => res.data),
  });
}
