import { Button } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import type { Exercise } from "../../types/types";
import api from "../../utils/api";

type DeleteExerciseModalProps = {
  exerciseId: number;
  workoutId: number;
  setIsDeletingExercise: React.Dispatch<React.SetStateAction<boolean>>;
  isOptimisticVariant?: boolean;
};

export default function DeleteExerciseModal({
  exerciseId,
  workoutId,
  setIsDeletingExercise,
  isOptimisticVariant,
}: DeleteExerciseModalProps) {
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      api.delete(`workouts/${workoutId}/exercises/${exerciseId}/`),
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      queryClient.setQueryData<Exercise[]>(["workout", workoutId], (previous) =>
        previous?.filter((exercise) => exercise.id !== exerciseId)
      );

      toast.success("Exercise deleted");
      setIsDeletingExercise(false);
    },
  });

  return (
    <>
      {displayConfirmation ? (
        <Button
          bg="red.9"
          size="md"
          onClick={() => mutate()}
          loading={isPending}
        >
          Confirm
        </Button>
      ) : (
        <Button
          bg="red.7"
          size="md"
          onClick={() => setDisplayConfirmation(true)}
          loading={isOptimisticVariant}
        >
          Delete
        </Button>
      )}
    </>
  );
}
