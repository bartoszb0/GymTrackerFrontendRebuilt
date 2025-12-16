import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, Flex, NumberInput } from "@mantine/core";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import useChangeProteinGoal from "../../hooks/mutations/useChangeProteinGoal";

const schema = z.object({
  protein_goal: z
    .number("Number is required")
    .min(1, "Goal must be at least 1 gram")
    .max(500, "Goal can't exceed 500 grams"),
});

type FormFields = z.infer<typeof schema>;

export default function ChangeProteinGoalForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useChangeProteinGoal();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    mutate(data, {
      onSuccess: () => {
        reset(); // TODO make this sh work
      },
      onError: (error) => {
        setError("root", error);
      },
    });
  };

  return (
    <Card bg="dark.8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex align="stretch" gap="sm">
          <Box flex={1}>
            <Controller
              name="protein_goal"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Change protein goal"
                  size="lg"
                  error={
                    (errors.protein_goal && errors.protein_goal.message) ||
                    errors.root?.message
                  }
                  clampBehavior="strict"
                  min={1}
                  allowDecimal={false}
                  suffix="g"
                  disabled={isPending}
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
