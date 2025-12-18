import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, Flex, NumberInput } from "@mantine/core";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import useAddProtein from "../../hooks/mutations/useAddProtein";

const schema = z.object({
  protein_to_add: z
    .union([z.literal(""), z.number().min(1, "At least 1 gram is required")])
    .refine((val) => val !== "", "Number is required"),
});

type FormFields = { protein_to_add: number | "" };

export default function AddProteinForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { protein_to_add: "" },
  });

  const { mutate, isPending } = useAddProtein();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    mutate(data as { protein_to_add: number }, {
      onSuccess: () => {
        reset();
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
                  allowDecimal={false}
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
