import { useSuspenseQuery } from "@tanstack/react-query";
import NotFoundArray from "../../components/NotFoundArray";
import type { Workout } from "../../types/types";
import api from "../../utils/api";

export default function Workouts() {
  const { data: workouts } = useSuspenseQuery<Workout[]>({
    queryKey: ["workouts"],
    queryFn: () => api.get("workouts/").then((res) => res.data),
  });

  console.log(workouts);

  return (
    <>
      {workouts.length <= 0 ? (
        <NotFoundArray arrayName="workout" />
      ) : (
        workouts.map((workout) => {
          return <h1>{workout.name}</h1>;
        })
      )}
    </>
  );
}
