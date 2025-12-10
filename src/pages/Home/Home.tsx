import { Stack, Text } from "@mantine/core";
import DataContentWrapper from "../../components/DataContentWrapper";
import Workouts from "./Workouts";

export default function Home() {
  return (
    <Stack m="lg">
      <Text size="30px" fw={600}>
        All workouts
      </Text>
      <DataContentWrapper>
        <Workouts />
      </DataContentWrapper>
    </Stack>
  );
}
