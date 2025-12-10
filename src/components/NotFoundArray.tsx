import { Flex, Text } from "@mantine/core";

type NotFoundArrayProps = {
  arrayName: string;
};

export default function NotFoundArray({ arrayName }: NotFoundArrayProps) {
  return (
    <Flex align="center" justify="center">
      <Text fs="italic" size="30px" mt="xl">
        No {arrayName} found
      </Text>
    </Flex>
  );
}
