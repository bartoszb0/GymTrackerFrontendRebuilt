import { Button, Flex, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import useDeleteWorkout from "../../hooks/mutations/useDeleteWorkout";

type DeleteWorkoutModalProps = {
  workoutId: number;
};

export default function DeleteWorkoutModal({
  workoutId,
}: DeleteWorkoutModalProps) {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

  const { mutate, isPending } = useDeleteWorkout();

  const closeModal = () => {
    if (!isPending) {
      close();
    }
  };

  const mutateAndNavigate = () => {
    mutate(workoutId, {
      onSuccess: () => navigate("/"),
    });
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
        <Flex mt="xl" gap="sm" justify="center">
          <Button
            size="xl"
            w={150}
            bg="red.9"
            onClick={mutateAndNavigate}
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
      <Button size="xl" onClick={open} bg="red.9">
        Delete workout
      </Button>
    </>
  );
}
