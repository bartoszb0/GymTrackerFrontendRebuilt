import { Flex, Text } from "@mantine/core";

type NotFoundArrayProps = {
  arrayName: string;
};

export default function NotFoundArray({ arrayName }: NotFoundArrayProps) {
  return (
    <Flex align="center" justify="center" bg="dark.8">
      <Text fs="italic" size="30px" m="xl">
        No {arrayName} found
      </Text>
    </Flex>
  );
}
