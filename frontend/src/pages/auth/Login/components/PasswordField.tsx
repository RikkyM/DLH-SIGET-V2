import { useId, useState } from "react";
import type { TextFieldProps } from "../_types";
import { Eye, EyeOff } from "lucide-react";

const PasswordField = ({
  label,
  id,
  containerClassName = "space-y-2",
  className = "",
  ...props
}: TextFieldProps) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [show, setShow] = useState(false);

  return (
    <div className={containerClassName}>
      <label htmlFor={inputId} className="block text-sm font-medium">
        {label}
      </label>
      <div className="flex w-full items-center rounded border border-gray-300 px-3 py-2 text-sm transition-all duration-300 focus-within:ring focus-within:ring-blue-300 focus-within:outline-none">
        <input
          id={inputId}
          type={show ? "text" : "password"}
          className={["w-full focus:outline-none", className].join(" ")}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="size-5 cursor-pointer rounded-full transition-colors duration-300 hover:bg-gray-300"
        >
          {show ? (
            <EyeOff className="h-full w-full" />
          ) : (
            <Eye className="h-full w-full" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
