import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Flex, NumberInput } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import type { Exercise } from "../../types/types";
import api from "../../utils/api";

type UpdateExerciseProps = {
  exercise: Exercise;
  workoutId: number;
  closeModal: () => void;
};

const schema = z.object({
  reps: z
    .number("Number is required")
    .min(1, "Number must be positive")
    .optional(),
  weight: z
    .number("Number required")
    .min(0.0, "Number can't be negative")
    .optional(),
});

type FormFields = z.infer<typeof schema>;

export default function UpdateExercise({
  exercise,
  workoutId,
  closeModal,
}: UpdateExerciseProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormFields) =>
      api
        .patch(`/workouts/${workoutId}/exercises/${exercise.id}/`, data)
        .then((res) => res.data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["workout", workoutId] });
      const previous = queryClient.getQueryData<Exercise[]>([
        "workout",
        workoutId,
      ]);

      const updatedExercises = previous?.map((oldExercise) => {
        console.log(oldExercise);
        if (oldExercise.id === exercise.id) {
          return {
            ...oldExercise,
            reps: data.reps ?? exercise.reps,
            weight: data.weight ?? exercise.weight,
            optimistic: true,
          };
        }
        return oldExercise;
      });

      queryClient.setQueryData(["workout", workoutId], updatedExercises);
      return { previous };
    },
    onError: (error, _, context) => {
      if (context) {
        queryClient.setQueryData(["workout", workoutId], context.previous);
      }
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout", workoutId] });
      toast.success("Changes saved");
      closeModal();
    },
  });

  const { control, handleSubmit } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (data.reps != undefined || data.weight != undefined) {
      mutate(data);
    } else {
      closeModal();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card bg="dark.8">
          <Controller
            name="reps"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Reps"
                size="xl"
                min={1}
                allowDecimal={false}
                defaultValue={exercise.reps}
                w={200}
              />
            )}
          />
          <Controller
            name="weight"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                mt="sm"
                label="Weight"
                size="xl"
                min={0.0}
                decimalScale={2}
                fixedDecimalScale
                defaultValue={exercise.weight}
                w={200}
              />
            )}
          />
        </Card>
        <Flex align="center" justify="center" mt="sm">
          <Button
            size="xl"
            type="submit"
            bg="green.9"
            w={200}
            loading={isPending}
          >
            Save changes
          </Button>
        </Flex>
      </form>
    </>
  );
}
