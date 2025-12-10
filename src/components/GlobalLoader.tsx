import { Flex, Loader } from "@mantine/core";

export default function GlobalLoader() {
  return (
    <Flex p="xl" m="xl" align="center" justify="center">
      <Loader size="lg" />
    </Flex>
  );
}
