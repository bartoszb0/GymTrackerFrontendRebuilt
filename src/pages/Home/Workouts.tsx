import { Card, ScrollArea, SimpleGrid, Text } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import NotFoundArray from "../../components/NotFoundArray";
import type { Workout } from "../../types/types";
import api from "../../utils/api";

export default function Workouts() {
  const { data: workouts } = useSuspenseQuery<Workout[]>({
    queryKey: ["workouts"],
    queryFn: () => api.get("workouts/").then((res) => res.data),
  });

  const workoutsElement = workouts.map((workout) => {
    return (
      <Card
        mb="sm"
        mt="sm"
        key={workout.id}
        onClick={() => console.log(workout.id)}
      >
        <Text size="35px" m="3px">
          {workout.name}
        </Text>
      </Card>
    );
  });

  return (
    <>
      {workouts.length <= 0 ? (
        <NotFoundArray arrayName="workout" />
      ) : (
        <SimpleGrid cols={1}>
          <ScrollArea mah="60vh">{workoutsElement}</ScrollArea>
        </SimpleGrid>
      )}
    </>
  );
}
