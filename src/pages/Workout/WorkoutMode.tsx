import { Button, Card, Flex, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useEffect, useState } from "react";
import type { Exercise } from "../../types/types";
import displayWeight from "../../utils/displayWeight";
import UpdateExercise from "./UpdateExercise";

type WorkoutModeProps = {
  exercise: Exercise;
  workoutId: number;
};

export default function WorkoutMode({ exercise, workoutId }: WorkoutModeProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentSet, setCurrentSet] = useState(0);
  const [isFinishingExercise, setIsFinishingExercise] = useState(false);

  useEffect(() => {
    if (currentSet === exercise.sets) {
      setIsFinishingExercise(true);
    }
  }, [currentSet]);

  const openModal = () => {
    setCurrentSet(0);
    setIsFinishingExercise(false);
    open();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        fullScreen
        withCloseButton={false}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Stack align="center" mt="30px">
          <Text
            size="30px"
            fw={600}
            ta="center"
            style={{
              wordBreak: "break-word",
            }}
          >
            {exercise.name}
          </Text>
          <Stack mt="sm" align="center">
            <Card bg="orange.8" c="white">
              <Text size="30px" fw={700} fs="italic">
                Set {currentSet} of {exercise.sets}
              </Text>
            </Card>

            <Flex justify="space-between" w={300} mt="sm">
              <Stack>
                <Text size="25px" ta="left">
                  Reps:
                </Text>
                <Text size="25px" ta="left">
                  Weight:
                </Text>
              </Stack>
              <Stack>
                <Text size="25px" ta="right">
                  {exercise.reps}
                </Text>
                <Text size="25px" ta="right">
                  {displayWeight(exercise.weight)}
                </Text>
              </Stack>
            </Flex>

            <Flex align="center" direction="column" gap="sm" mt="sm">
              {isFinishingExercise ? (
                <UpdateExercise
                  exercise={exercise}
                  workoutId={workoutId}
                  closeModal={close}
                />
              ) : (
                <Button
                  mt="lg"
                  size="xl"
                  w={200}
                  onClick={() => setCurrentSet((prev) => prev + 1)}
                >
                  Finished set
                </Button>
              )}

              <Button size="lg" bg="red.9" w={200} onClick={close}>
                Abort workout
              </Button>
            </Flex>
          </Stack>
        </Stack>
      </Modal>

      <Button
        size="md"
        loading={exercise.optimistic}
        style={{ flexShrink: 0 }}
        onClick={openModal}
      >
        <PlayArrowIcon fontSize="large" />
      </Button>
    </>
  );
}
