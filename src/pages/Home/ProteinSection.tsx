import { Box, Flex, RingProgress, Stack, Text } from "@mantine/core";

export default function ProteinSection() {
  return (
    <Box
      w="95%"
      h={120}
      pos="fixed"
      bottom={10}
      style={{
        left: 0,
        right: 0,
        margin: "auto", // This centers the block-level element horizontally
      }}
      bdrs="md"
      bg="dark.6"
    >
      <Flex justify="space-between">
        <Stack m="sm">
          <Text>Today's progress:</Text>
          <Text>40/100</Text>
        </Stack>
        <RingProgress
          label={
            <Text size="xl" ta="center" c="orange.2">
              40%
            </Text>
          }
          sections={[{ value: 40, color: "orange.3" }]}
          thickness={15}
        />
      </Flex>
    </Box>
  );
}
