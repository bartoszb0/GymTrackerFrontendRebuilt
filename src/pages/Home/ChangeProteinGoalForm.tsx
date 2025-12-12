import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, Flex, NumberInput } from "@mantine/core";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  proteinGoal: z
    .number("Number is required")
    .min(1, "Goal must be at least 1 gram"),
});

type FormFields = z.infer<typeof schema>;

export default function ChangeProteinGoalForm() {
  const { control, handleSubmit, reset } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log(data);
    reset();
  };

  return (
    <Card bg="dark.8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex align="stretch" gap="sm">
          <Box flex={1}>
            <Controller
              name="proteinGoal"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Change protein goal"
                  size="lg"
                  min={1}
                />
              )}
            />
          </Box>
          <Button type="submit" size="lg" h={"80"}>
            Submit
          </Button>
        </Flex>
      </form>
    </Card>
  );
}
