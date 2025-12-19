import { useDialog } from "@/hooks/useDialog";
import { Pencil } from "lucide-react";
import type { PetugasRes } from "../__types";

type Props = {
  data: PetugasRes;
};

const EditButton = ({ data }: Props) => {
  const { openDialog } = useDialog<PetugasRes>();
  return (
    <button
      onClick={() => openDialog(data)}
      className="cursor-pointer rounded p-1 transition-colors hover:bg-gray-300"
    >
      <Pencil className="max-w-5" />
    </button>
  );
};

export default EditButton;
