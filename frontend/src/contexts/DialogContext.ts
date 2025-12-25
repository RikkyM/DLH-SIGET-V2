import type { DialogMode } from "@/providers/DialogProvider";
import { createContext } from "react";

type DialogContextType = {
  isOpen: boolean;
  data: unknown;
  mode: DialogMode | undefined;
  openDialog: (mode?: DialogMode, data?: unknown) => void;
  closeDialog: () => void;
};

export const DialogContext = createContext<DialogContextType | null>(null);
