import { DialogContext } from "@/contexts/DialogContext";
import { useCallback, useMemo, useState, type ReactNode } from "react";

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<unknown>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = useCallback((getData?: unknown) => {
    setData(getData ?? null);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setData(null);
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ isOpen, data, openDialog, closeDialog }),
    [isOpen, data, openDialog, closeDialog],
  );

  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
};
