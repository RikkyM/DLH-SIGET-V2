import { useDialog } from "@/hooks/useDialog";
import { FileText } from "lucide-react";
import type { PetugasRes } from "../__types";

type Props = {
  data: PetugasRes;
};

const EditButton = ({ data }: Props) => {
  const { openDialog } = useDialog<PetugasRes>();
  return (
    <button
      onClick={() => openDialog('detail', data)}
      className="cursor-pointer rounded p-1 transition-colors hover:bg-gray-200"
    >
      <FileText className="max-w-5" />
    </button>
  );
};

export default EditButton;
