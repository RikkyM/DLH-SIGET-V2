import { memo, type ChangeEvent, type HTMLInputTypeAttribute } from "react";

type Props = {
  label: string;
  name: string;
  id?: string;
  value: string;
  placeholder?: string;
  error?: string;
  className?: string;
  type?: HTMLInputTypeAttribute;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const FormTextField = ({
  label,
  name,
  id,
  value,
  placeholder,
  error,
  className,
  type = 'text',
  onChange,
}: Props) => {
  return (
    <div className={`space-y-1 text-sm ${className}`}>
      <label htmlFor={id} className="block w-max font-medium">
        {label}
      </label>
      <input
        className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default memo(FormTextField);
