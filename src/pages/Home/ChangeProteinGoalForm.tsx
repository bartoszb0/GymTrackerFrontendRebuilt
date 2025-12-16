import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, Flex, NumberInput } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import type { ProteinInfo } from "../../types/types";
import api from "../../utils/api";

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

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormFields) => api.patch("protein/", data),

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["protein"] });

      const previous = queryClient.getQueryData<ProteinInfo>(["protein"]);

      queryClient.setQueryData(["protein"], {
        ...previous,
        protein_goal: data.protein_goal,
      });

      return { previous };
    },

    onError: (error, _, context) => {
      toast.error("Failed to change protein goal");
      if (context) {
        queryClient.setQueryData(["protein"], context.previous);
      }
      setError("root", error);
    },

    onSuccess: () => {
      toast.success("Protein goal changed");
      queryClient.invalidateQueries({ queryKey: ["protein"] });
      reset(); // TODO make this sh work
    },
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    mutate(data);
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
