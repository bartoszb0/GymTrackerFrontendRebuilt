import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, NumberInput, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import type { Exercise } from "../../types/types";
import api from "../../utils/api";

type NewExerciseModalProps = {
  workoutId: number;
};

const schema = z.object({
  name: z
    .string()
    .min(1, "Exercise Name is required")
    .max(30, "Exercise Name must be less than 30 characters")
    .trim(),
  sets: z.number("Number required").min(1, "Number must be positive"),
  reps: z.number("Number required").min(1, "Number must be positive"),
  weight: z
    .number("Number required")
    .min(0.01, "Number must be positive")
    .optional(),
});

type FormFields = z.infer<typeof schema>;

export default function NewExerciseModal({ workoutId }: NewExerciseModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormFields) =>
      api.post(`workouts/${workoutId}/exercises/`, data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["workout", workoutId] });

      const previous = queryClient.getQueryData<Exercise[]>([
        "workout",
        workoutId,
      ]);

      const optimisticExercise: Exercise = {
        id: -Date.now(), // temporary negative ID
        name: data.name,
        sets: data.sets,
        reps: data.reps,
        weight: data.weight ?? 0,
        optimistic: true,
      };

      queryClient.setQueryData<Exercise[]>(
        ["workout", workoutId],
        [...(previous ?? []), optimisticExercise]
      );

      return { previous };
    },
    onError: (error, _, context) => {
      toast.error("Failed to create exercise");
      if (context) {
        queryClient.setQueryData<Exercise[]>(
          ["workout", workoutId],
          context.previous
        );
      }
      setError("root", error);
    },
    onSuccess: () => {
      toast.success("Exercise created");
      queryClient.invalidateQueries({ queryKey: ["workout", workoutId] });
      reset(); // crucial for avoiding rapidly clicking to create bunch of same exercise
      close();
    },
  });

  const {
    control,
    register,
    handleSubmit,
    setError,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    mutate(data);
  };

  const closeModal = () => {
    if (!isPending) {
      close();
    }
  };

  const openModal = () => {
    clearErrors();
    reset();
    open();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={closeModal}
        yOffset="20vh"
        withCloseButton={false}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset
            disabled={isPending}
            style={{
              border: "none",
              padding: 0,
              margin: 0,
            }}
          >
            <TextInput
              {...register("name")}
              label="Exercise Name"
              size="lg"
              mt="sm"
              error={errors.name && errors.name.message}
              autoComplete="off"
            ></TextInput>

            <Controller
              name="sets"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Sets"
                  size="lg"
                  mt="sm"
                  min={1}
                  allowDecimal={false}
                  error={errors.sets && errors.sets.message}
                />
              )}
            />

            <Controller
              name="reps"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Reps"
                  size="lg"
                  mt="sm"
                  min={1}
                  allowDecimal={false}
                  error={errors.reps && errors.reps.message}
                />
              )}
            />

            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Weight"
                  description="Leave empty for bodyweight"
                  size="lg"
                  mt="sm"
                  min={0.01}
                  decimalScale={2}
                  fixedDecimalScale
                  error={errors.weight && errors.weight.message}
                />
              )}
            />
          </fieldset>

          {errors.root && (
            <Text size="lg" mt="md" c="red.8">
              {errors.root.message}
            </Text>
          )}

          <Button type="submit" size="xl" mt="lg" fullWidth loading={isPending}>
            Create Exercise
          </Button>
        </form>
      </Modal>
      <Button size="xl" onClick={() => openModal()}>
        Add new exercise
      </Button>
    </>
  );
}
