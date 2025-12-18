import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, NumberInput, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import useCreateExercise from "../../hooks/mutations/useCreateExercise";

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
    .min(0.0, "Number can't be negative")
    .optional(),
});

type FormFields = z.infer<typeof schema>;

export default function NewExerciseModal({ workoutId }: NewExerciseModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const { mutate, isPending } = useCreateExercise(workoutId);

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

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    mutate(data, {
      onSuccess: () => {
        reset(); // crucial for avoiding rapidly clicking to create bunch of same exercise
        close();
      },
      onError: (error) => {
        setError("root", error);
      },
    });
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
      <Modal opened={opened} onClose={closeModal} withCloseButton={false}>
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
                  min={0.0}
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
