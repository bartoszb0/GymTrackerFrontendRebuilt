import { Stack, Text } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import DataContentWrapper from "../../components/DataContentWrapper";
import type { Workout } from "../../types/types";
import isIdValid from "../../utils/isIdValid";
import NotFound from "../NotFound";
import DeleteWorkoutModal from "./DeleteWorkoutModal";
import Exercises from "./Exercises";
import NewExerciseModal from "./NewExerciseModal";

export default function Workout() {
  const { workoutId } = useParams();
  const { safeId, isValid } = isIdValid(workoutId);

  if (!isValid) return <NotFound />;

  const queryClient = useQueryClient();
  const workouts = queryClient.getQueryData<Workout[]>(["workouts"]);
  const workoutFromCache = workouts?.find((w) => w.id === safeId);
  const workoutName = workoutFromCache?.name || "Workout";

  const [isDeletingExercise, setIsDeletingExercise] = useState(false);

  return (
    <Stack m="sm" mt="lg">
      <Text>{workoutName}</Text>
      <DataContentWrapper>
        <Exercises
          id={safeId}
          isDeletingExercise={isDeletingExercise}
          setIsDeletingExercise={setIsDeletingExercise}
        />
        {!isDeletingExercise && (
          <>
            <NewExerciseModal id={safeId} />
            <DeleteWorkoutModal id={safeId} />
          </>
        )}
      </DataContentWrapper>
    </Stack>
  );
}
