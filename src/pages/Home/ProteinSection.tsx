import { Box, Flex, RingProgress, Text } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import api from "../../utils/api";
import getPercent from "../../utils/getPercent";

type ProteinInfo = {
  todays_protein: number;
  protein_goal: number;
}; // TODO move this to types.ts

export default function ProteinSection() {
  const { data: proteinInfo } = useSuspenseQuery<ProteinInfo>({
    queryKey: ["protein"], // add here user id as well in future (?)
    queryFn: () => api.get("protein/").then((res) => res.data),
  });

  const percent = getPercent(
    proteinInfo.todays_protein,
    proteinInfo.protein_goal
  );

  return (
    <Box
      w="95%"
      h={120}
      pos="fixed"
      bottom={10}
      style={{
        left: 0,
        right: 0,
        margin: "auto",
      }}
      bdrs="md"
      bg="dark.6"
    >
      <Flex justify="space-between">
        <Flex m="sm" justify="center" direction="column" gap="md">
          <Text size="18px">Today's daily protein goal:</Text>
          <Text size="30px">
            {proteinInfo.todays_protein}g/
            <Text span c="orange.5" inherit>
              {proteinInfo.protein_goal}g
            </Text>
          </Text>
        </Flex>
        <RingProgress
          label={
            <Text size="xl" ta="center" c="orange.5">
              {percent + "%"}
            </Text>
          }
          sections={[{ value: percent, color: "orange.5" }]}
          thickness={15}
        />
      </Flex>
    </Box>
  );
}
