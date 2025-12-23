import { DialogContext } from "@/contexts/DialogContext";
import { useCallback, useMemo, useState, type ReactNode } from "react";

export type DialogMode = "edit" | "detail" | undefined;

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<unknown>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<DialogMode>();

  const openDialog = useCallback(
    (getData?: unknown, mode: DialogMode = "detail") => {
      setData(getData ?? null);
      setMode(mode);
      setIsOpen(true);
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setData(null);
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ isOpen, data, mode, openDialog, closeDialog }),
    [isOpen, data, mode, openDialog, closeDialog],
  );

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
};
