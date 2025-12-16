import { Button } from "@mantine/core";
import { useState } from "react";
import { toast } from "react-toastify";
import useDeleteExercise from "../../hooks/mutations/useDeleteExercise";

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
  const { mutate, isPending } = useDeleteExercise(workoutId, exerciseId);

  const mutateAndCleanup = () => {
    mutate(undefined, {
      onSuccess: () => {
        setIsDeletingExercise(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <>
      {displayConfirmation ? (
        <Button
          bg="red.9"
          size="md"
          onClick={mutateAndCleanup}
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
