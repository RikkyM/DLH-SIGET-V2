import { useDialog } from "@/hooks/useDialog";
import type { ReactNode } from "react";

const Dialog = ({
  children,
  size = "xl",
}: {
  children: ReactNode;
  size?: string;
}) => {
  const { isOpen, closeDialog } = useDialog();

  return (
    <div
      onClick={closeDialog}
      className={`absolute inset-0 z-40 grid place-items-center transition-all duration-300 ${
        isOpen
          ? "pointer-events-auto bg-black/20 opacity-100 backdrop-blur-xs duration-300"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className={`grid h-full w-full place-items-center overflow-hidden px-3 py-10 ${size}`}
      >
        <section
          onClick={(e) => e.stopPropagation()}
          className={`max-h-full w-full max-w-4xl space-y-3 overflow-auto rounded-sm bg-white p-3 shadow transition-all duration-300 ${
            isOpen ? "scale-100" : "scale-95"
          }`}
        >
          {children}
        </section>
      </div>
    </div>
  );
};

export default Dialog;
