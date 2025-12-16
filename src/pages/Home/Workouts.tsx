import { Card, ScrollArea, SimpleGrid, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import NotFoundArray from "../../components/NotFoundArray";
import useWorkouts from "../../hooks/queries/useWorkouts";

export default function Workouts() {
  const { data: workouts } = useWorkouts();

  const workoutsElement = workouts.map((workout) => {
    return (
      <Card
        mb="sm"
        mt="sm"
        key={workout.id}
        component={Link}
        to={workout.optimistic ? "#" : `workout/${workout.id}`} // dummy link for optimistic
        bg={workout.optimistic ? "dark.5" : undefined}
        style={{
          cursor: workout.optimistic ? "not-allowed" : "pointer",
          pointerEvents: workout.optimistic ? "none" : "auto",
          opacity: workout.optimistic ? 0.6 : 1,
        }}
      >
        <Text size="30px" m="3px" truncate="end">
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
