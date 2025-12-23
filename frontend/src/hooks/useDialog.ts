import { DialogContext } from "@/contexts/DialogContext";
import type { DialogMode } from "@/providers/DialogProvider";
import { useContext } from "react";

export const useDialog = <T>() => {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialog must be used within DialogProvider");
  }

  return {
    isOpen: ctx.isOpen,
    data: ctx.data as T | null,
    mode: ctx.mode,
    openDialog: (data?: T, mode?: DialogMode) => ctx.openDialog(data, mode),
    closeDialog: ctx.closeDialog,
  };
};
