import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
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

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormFields) => api.post("workouts/", data),
    onError: (error) => setError("root", error),
  });

  type FormFields = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    mutate(data);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        yOffset="30vh"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset
            disabled={isPending}
            style={{ border: "none", padding: 0, margin: 0 }}
          >
            <TextInput
              {...register("name")}
              size="xl"
              label="Workout Name"
              placeholder="e.g. Legs"
              error={
                (errors.name && errors.name.message) || errors.root?.message
              }
              autoComplete="off"
            />

            <Button size="xl" type="submit" bg="green.9" fullWidth mt="lg">
              Create
            </Button>
          </fieldset>
        </form>
      </Modal>
      <Button size="xl" onClick={open}>
        Create new workout
      </Button>
    </>
  );
}
