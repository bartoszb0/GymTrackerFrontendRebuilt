import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import type { Workout } from "../../types/types";
import api from "../../utils/api";

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

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormFields) => api.post("workouts/", data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["workouts"] });

      const previous = queryClient.getQueryData<Workout[]>(["workouts"]);

      const newWorkout = {
        id: -Date.now(),
        name: data.name,
        optimistic: true,
      };

      queryClient.setQueryData(["workouts"], [...(previous ?? []), newWorkout]);

      return { previous };
    },
    onError: (error, _, context) => {
      toast.error("Failed to create exercise");
      if (context) {
        queryClient.setQueryData(["workouts"], context.previous);
      }
      setError("root", error);
    },
    onSuccess: () => {
      toast.success("Workout created");
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      reset(); // crucial for avoiding rapidly clicking to create bunch of same workout
      close();
    },
  });

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

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    mutate(data);
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
