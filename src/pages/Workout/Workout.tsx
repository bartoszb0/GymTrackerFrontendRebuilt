import { Button, Flex, Stack, Text } from "@mantine/core";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import DataContentWrapper from "../../components/DataContentWrapper";
import getWorkoutName from "../../utils/getWorkoutName";
import isIdValid from "../../utils/isIdValid";
import NotFound from "../NotFound";
import DeleteWorkoutModal from "./DeleteWorkoutModal";
import Exercises from "./Exercises";
import NewExerciseModal from "./NewExerciseModal";

export default function Workout() {
  const { workoutId } = useParams();
  const { safeId, isValid } = isIdValid(workoutId);

  if (!isValid) return <NotFound />;

  const [isDeletingExercise, setIsDeletingExercise] = useState(false);

  return (
    <Stack m="sm" mt="lg">
      <Flex gap="md" align="center">
        <Button bg="dark.8" size="lg" component={Link} to="/">
          <ArrowBackIcon fontSize="large" />
        </Button>
        <Text fw={700} size="30px" truncate="end">
          {getWorkoutName(safeId)}
        </Text>
      </Flex>
      <DataContentWrapper>
        <Exercises
          workoutId={safeId}
          isDeletingExercise={isDeletingExercise}
          setIsDeletingExercise={setIsDeletingExercise}
        />
        {!isDeletingExercise && (
          <>
            <NewExerciseModal workoutId={safeId} />
            <DeleteWorkoutModal workoutId={safeId} />
          </>
        )}
      </DataContentWrapper>
    </Stack>
  );
}
