import { Button, Flex, Text, Title } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";

type ErrorPageProps = {
  error: Error;
  resetErrorBoundary: (...args: any[]) => void;
};

export default function ErrorPage({
  error,
  resetErrorBoundary,
}: ErrorPageProps) {
  const queryClient = useQueryClient();

  const handleReset = () => {
    queryClient.resetQueries();
    resetErrorBoundary();
  };

  return (
    <Flex direction="column" align="center" justify="center" p="lg" mt="lg">
      <Title c="red">Error</Title>
      <Text c="dimmed" mt="md" style={{ textAlign: "center" }} size="xl">
        {error.message}
      </Text>
      <Button
        onClick={handleReset}
        c="red"
        variant="default"
        bg="dark.5"
        mt="lg"
      >
        Try Reloading Page
      </Button>
    </Flex>
  );
}
