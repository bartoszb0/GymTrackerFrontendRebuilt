import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, Flex, NumberInput } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import type { ProteinInfo } from "../../types/types";
import api from "../../utils/api";

const schema = z.object({
  protein_to_add: z
    .number("Number is required")
    .min(1, "At least 1 gram is required"),
});

type FormFields = z.infer<typeof schema>;

export default function AddProteinForm() {
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
        todays_protein:
          (previous ? previous.todays_protein : 0) + data.protein_to_add,
      });

      return { previous };
    },

    onError: (error, _, context) => {
      toast.error("Failed to add protein");
      if (context) {
        queryClient.setQueryData(["protein"], context.previous);
      }
      setError("root", error);
    },

    onSuccess: () => {
      toast.success("Protein added");
      queryClient.invalidateQueries({ queryKey: ["protein"] });
      reset(); // TODO make this sh work
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    mutate(data);
  };

  return (
    <Card bg="dark.8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex align="stretch" gap="sm">
          <Box flex={1}>
            <Controller
              name="protein_to_add"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Add protein"
                  size="lg"
                  error={
                    (errors.protein_to_add && errors.protein_to_add.message) ||
                    errors.root?.message
                  }
                  clampBehavior="strict"
                  min={1}
                  suffix="g"
                  disabled={isPending}
                />
              )}
            />
          </Box>
          <Button type="submit" size="lg" h={"80"} loading={isPending}>
            Submit
          </Button>
        </Flex>
      </form>
    </Card>
  );
}
