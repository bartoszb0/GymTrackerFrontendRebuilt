import {
  Button,
  Card,
  Flex,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useSuspenseQuery } from "@tanstack/react-query";
import NotFoundArray from "../../components/NotFoundArray";
import type { Exercise } from "../../types/types";
import api from "../../utils/api";

type ExercisesProps = {
  id: number;
  isDeletingExercise: boolean;
  setIsDeletingExercise: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Exercises({
  id,
  isDeletingExercise,
  setIsDeletingExercise,
}: ExercisesProps) {
  const { data: exercises } = useSuspenseQuery<Exercise[]>({
    queryKey: ["workout", id],
    queryFn: () => api.get(`workouts/${id}/exercises/`).then((res) => res.data),
  });

  const exercisesElement = exercises.map((exercise) => {
    return (
      <Card
        mb="sm"
        mt="sm"
        key={exercise.id}
        onClick={() => console.log(exercise.id)}
      >
        <Flex justify="space-between" align="center">
          <Text size="20px" m="3px">
            {exercise.name} - {exercise.sets}x{exercise.reps} -{" "}
            {exercise.weight}
          </Text>
          {isDeletingExercise ? (
            <Button bg="red.8" size="md">
              Delete
            </Button>
          ) : (
            <Button size="md">
              <PlayArrowIcon fontSize="large" />
            </Button>
          )}
        </Flex>
      </Card>
    );
  });

  return (
    <>
      {exercises.length <= 0 ? (
        <NotFoundArray arrayName="exercise" />
      ) : (
        <Stack>
          <SimpleGrid cols={1}>
            <ScrollArea mah="60vh">{exercisesElement}</ScrollArea>
          </SimpleGrid>
          {!isDeletingExercise ? (
            <Button size="xl" onClick={() => setIsDeletingExercise(true)}>
              Delete exercise
            </Button>
          ) : (
            <Button size="xl" onClick={() => setIsDeletingExercise(false)}>
              Done
            </Button>
          )}
        </Stack>
      )}
    </>
  );
}
