import { useId } from "react";
import type { TextFieldProps } from "../_types";

const TextField = ({
  label,
  id,
  containerClassName = "space-y-2",
  className = "",
  ...props
}: TextFieldProps) => {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className={containerClassName}>
      <label htmlFor={inputId} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        className={[
          "w-full rounded border border-gray-300 px-3 py-2 text-sm transition-all duration-300 focus:ring focus:ring-blue-300 focus:outline-none",
          className,
        ].join(" ")}
        {...props}
      />
    </div>
  );
};

export default TextField;
