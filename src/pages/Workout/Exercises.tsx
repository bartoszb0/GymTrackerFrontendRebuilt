import { ScrollArea, SimpleGrid } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import NotFoundArray from "../../components/NotFoundArray";
import api from "../../utils/api";

type ExercisesProps = {
  id: number;
};

export default function Exercises({ id }: ExercisesProps) {
  const { data: exercises } = useSuspenseQuery<[]>({
    queryKey: ["workout", id],
    queryFn: () => api.get(`workouts/${id}/exercises/`).then((res) => res.data),
  });

  console.log(exercises);

  return (
    <>
      {exercises.length <= 0 ? (
        <NotFoundArray arrayName="exercise" />
      ) : (
        <SimpleGrid cols={1}>
          <ScrollArea mah="60vh">X</ScrollArea>
        </SimpleGrid>
      )}
    </>
  );
}
