import {
  Button,
  Card,
  Flex,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import NotFoundArray from "../../components/NotFoundArray";
import type { ApiExercise, Exercise } from "../../types/types";
import api from "../../utils/api";
import displayWeight from "../../utils/displayWeight";
import DeleteExerciseModal from "./DeleteExerciseModal";
import WorkoutMode from "./WorkoutMode";

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
      api.get(`workouts/${workoutId}/exercises/`).then((res) =>
        res.data.map((exercise: ApiExercise) => ({
          ...exercise,
          weight: parseFloat(exercise.weight), // convert to number
        }))
      ),
  });

  const exercisesElement = exercises.map((exercise) => {
    return (
      <Card
        mb="sm"
        mt="sm"
        key={exercise.id}
        bg={exercise.optimistic ? "dark.5" : undefined}
        style={{ opacity: exercise.optimistic ? 0.6 : 1 }}
      >
        <Flex justify="space-between" align="center" wrap="nowrap" gap="sm">
          <Text
            size="20px"
            m="3px"
            style={{
              flex: 1,
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {exercise.name} - {exercise.sets}x{exercise.reps} -{" "}
            {displayWeight(exercise.weight)}
          </Text>

          {isDeletingExercise ? (
            <DeleteExerciseModal
              exerciseId={exercise.id}
              workoutId={workoutId}
              setIsDeletingExercise={setIsDeletingExercise}
              isOptimisticVariant={exercise.optimistic}
            />
          ) : (
            <WorkoutMode exercise={exercise} workoutId={workoutId} />
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
