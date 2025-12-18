import { Modal, RingProgress, Stack, Text } from "@mantine/core";
import type { ProteinInfo } from "../../types/types";
import AddProteinForm from "./AddProteinForm";
import ChangeProteinGoalForm from "./ChangeProteinGoalForm";

type ProteinEditModalProps = {
  opened: boolean;
  close: () => void;
  proteinInfo: ProteinInfo;
  percent: number;
};

export default function ProteinEditModal({
  opened,
  close,
  proteinInfo,
  percent,
}: ProteinEditModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      fullScreen
      closeButtonProps={{
        size: "50",
      }}
      transitionProps={{ transition: "fade", duration: 200 }}
    >
      <Stack align="center">
        <RingProgress
          size={250}
          label={
            <Text size="60px" ta="center" c="orange.5">
              {percent + "%"}
            </Text>
          }
          sections={[{ value: percent, color: "orange.5" }]}
          thickness={20}
        />
        <Text size="30px">
          {proteinInfo.todays_protein}g/
          <Text span c="orange.5" inherit>
            {proteinInfo.protein_goal}g
          </Text>
        </Text>
        <Stack gap="md" mt="lg">
          <AddProteinForm />
          <ChangeProteinGoalForm />
        </Stack>
      </Stack>
    </Modal>
  );
}
