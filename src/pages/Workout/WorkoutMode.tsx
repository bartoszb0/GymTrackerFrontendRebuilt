import { Button, Card, Flex, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import type { Exercise } from "../../types/types";
import displayWeight from "../../utils/displayWeight";
import UpdateExercise from "./UpdateExercise";

type WorkoutModeProps = {
  exercise: Exercise;
  workoutId: number;
};

export default function WorkoutMode({ exercise, workoutId }: WorkoutModeProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isFinishingExercise, setIsFinishingExercise] = useState(false);

  const [currentSet, setCurrentSet, removeValue] = useLocalStorage(
    `currentSet${exercise.id}`,
    0
  );

  useEffect(() => {
    if (currentSet === exercise.sets) {
      setIsFinishingExercise(true);
    }
  }, [currentSet]);

  const closeModal = () => {
    removeValue();
    setIsFinishingExercise(false);
    close();
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
                  closeModal={closeModal}
                />
              ) : (
                <Button
                  mt="lg"
                  size="xl"
                  w={200}
                  onClick={() =>
                    setCurrentSet((prev) => Math.min(prev + 1, exercise.sets))
                  }
                >
                  Finished set
                </Button>
              )}

              <Button size="lg" bg="red.9" w={200} onClick={closeModal}>
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
        onClick={open}
        bg={currentSet ? "orange.8" : undefined}
      >
        {currentSet ? (
          <Text size="lg" fw={700}>
            {currentSet} / {exercise.sets}
          </Text>
        ) : (
          <PlayArrowIcon fontSize="large" />
        )}
      </Button>
    </>
  );
}
