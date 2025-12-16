import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, Flex, NumberInput } from "@mantine/core";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import useAddProtein from "../../hooks/mutations/useAddProtein";

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

  const { mutate, isPending } = useAddProtein();

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
