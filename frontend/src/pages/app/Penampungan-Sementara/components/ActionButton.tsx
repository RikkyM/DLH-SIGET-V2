import { useDialog } from "@/hooks/useDialog";
import { FileText, Pencil } from "lucide-react";
import type { PenampunganRes } from "../__types";

type Props = {
  data: PenampunganRes;
};

const ActionButton = ({ data }: Props) => {
  const { openDialog } = useDialog<PenampunganRes>();
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => openDialog(data, 'edit')}
        className="cursor-pointer rounded p-1 transition-colors hover:bg-gray-200"
      >
        <Pencil className="max-w-5" />
      </button>
      <button
        type="button"
        onClick={() => openDialog(data, 'detail')}
        className="cursor-pointer rounded p-1 transition-colors hover:bg-gray-200"
      >
        <FileText className="max-w-5" />
      </button>
    </div>
  );
};

export default ActionButton;
