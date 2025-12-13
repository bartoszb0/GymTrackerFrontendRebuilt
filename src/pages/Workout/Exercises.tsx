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
import DeleteExerciseModal from "./DeleteExerciseModal";

type ExercisesProps = {
  workoutId: number;
  isDeletingExercise: boolean;
  setIsDeletingExercise: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Exercises({
  workoutId,
  isDeletingExercise,
  setIsDeletingExercise,
}: ExercisesProps) {
  const { data: exercises } = useSuspenseQuery<Exercise[]>({
    queryKey: ["workout", workoutId],
    queryFn: () =>
      api.get(`workouts/${workoutId}/exercises/`).then((res) => res.data),
  });

  const exercisesElement = exercises.map((exercise) => {
    const isBodyweight = exercise.weight == "0.00";

    return (
      <Card
        mb="sm"
        mt="sm"
        key={exercise.id}
        bg={exercise.optimistic ? "dark.5" : undefined}
        style={{
          opacity: exercise.optimistic ? 0.6 : 1,
        }}
      >
        <Flex justify="space-between" align="center">
          <Text size="20px" m="3px">
            {exercise.name} - {exercise.sets}x{exercise.reps} -{" "}
            {!isBodyweight ? exercise.weight + "kg" : "Bodyweight"}
          </Text>
          {isDeletingExercise ? (
            <DeleteExerciseModal
              exerciseId={exercise.id}
              workoutId={workoutId}
              setIsDeletingExercise={setIsDeletingExercise}
            />
          ) : (
            <Button size="md" loading={exercise.optimistic}>
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
