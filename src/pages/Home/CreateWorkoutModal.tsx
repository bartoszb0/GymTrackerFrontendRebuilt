import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import useCreateWorkout from "../../hooks/mutations/useCreateWorkout";

const schema = z.object({
  name: z
    .string()
    .min(1, "Workout Name is required")
    .max(30, "Workout Name must be less than 30 characters")
    .trim(),
});

type FormFields = z.infer<typeof schema>;

export default function CreateWorkoutModal() {
  const [opened, { open, close }] = useDisclosure(false);

  const { mutate, isPending } = useCreateWorkout();

  const {
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
        reset();
        close();
      },
      onError: (error) => {
        setError("root", error);
      },
    });
  };

  const openModal = () => {
    clearErrors();
    reset();
    open();
  };

  const closeModal = () => {
    if (!isPending) {
      close();
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={closeModal}
        withCloseButton={false}
        yOffset="30vh"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            {...register("name")}
            size="xl"
            label="Workout Name"
            placeholder="e.g. Legs"
            error={(errors.name && errors.name.message) || errors.root?.message}
            autoComplete="off"
            disabled={isPending}
          />

          <Button
            size="xl"
            type="submit"
            bg="green.9"
            fullWidth
            mt="lg"
            loading={isPending}
          >
            Create
          </Button>
        </form>
      </Modal>
      <Button size="xl" onClick={() => openModal()}>
        Create new workout
      </Button>
    </>
  );
}
