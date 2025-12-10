import { Stack, Text } from "@mantine/core";
import DataContentWrapper from "../../components/DataContentWrapper";
import CreateWorkoutModal from "./CreateWorkoutModal";
import Workouts from "./Workouts";

export default function Home() {
  return (
    <Stack m="sm" mt="lg">
      <Text size="35px" fw={600}>
        All workouts
      </Text>
      <DataContentWrapper>
        <Workouts />
        <CreateWorkoutModal />
      </DataContentWrapper>
    </Stack>
  );
}
