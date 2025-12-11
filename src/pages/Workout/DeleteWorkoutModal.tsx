import { Button, Flex, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";

type DeleteWorkoutModalProps = {
  workoutId: number;
};

export default function DeleteWorkoutModal({
  workoutId,
}: DeleteWorkoutModalProps) {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.delete(`workouts/${workoutId}/`),
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      navigate("/");
      toast.success("Workout deleted");
    },
  });

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
        yOffset="30vh"
        withCloseButton={false}
      >
        <Text ta="center" size="25px">
          Are you sure you want to delete this workout?
        </Text>
        <Flex mt="xl" gap="sm">
          <Button
            size="xl"
            w={150}
            bg="red.9"
            onClick={() => mutate()}
            loading={isPending}
          >
            Delete
          </Button>
          <Button
            size="xl"
            w={150}
            bg="dark.9"
            onClick={closeModal}
            disabled={isPending}
          >
            Cancel
          </Button>
        </Flex>
      </Modal>
      <Button size="xl" onClick={open}>
        Delete workout
      </Button>
    </>
  );
}
