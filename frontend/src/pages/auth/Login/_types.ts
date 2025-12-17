import type { InputHTMLAttributes } from "react";

export type BaseProps = {
  label: string;
  id?: string;
  containerClassName?: string;
};

export type TextFieldProps = BaseProps & InputHTMLAttributes<HTMLInputElement>;
