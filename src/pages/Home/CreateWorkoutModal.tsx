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

export default function CreateWorkoutModal() {
  const [opened, { open, close }] = useDisclosure(false);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormFields) => api.post("workouts/", data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["workouts"] });

      const previous = queryClient.getQueryData<Workout[]>(["workouts"]);

      //TODO change ownerid to the one that'll be taken from jwt
      queryClient.setQueryData<Workout[]>(
        ["workouts"],
        [...(previous ?? []), { id: Date.now(), name: data.name, owner: 29 }]
      );

      return { previous };
    },
    onError: (error, _, context) => {
      toast.error("Failed to create exercise");
      if (context) {
        queryClient.setQueryData(["workouts"], context.previous);
      }
      setError("root", error);
    },
    // TODO manually invalidate query with proper id actually, so I need to take response data
    onSuccess: () => {
      toast.success("Workout created");
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      close();
    },
  });

  type FormFields = z.infer<typeof schema>;

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
