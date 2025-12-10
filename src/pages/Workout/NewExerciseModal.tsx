import { Button } from "@mantine/core";

type NewExerciseModalProps = {
  id: number;
};

export default function NewExerciseModal({ id }: NewExerciseModalProps) {
  return <Button size="xl">Add new exercise</Button>;
}
