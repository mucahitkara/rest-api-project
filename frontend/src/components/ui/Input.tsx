import clsx from "clsx";
import { useId } from "react";

type InputProps = {
  label?: string;
  placeholder?: string;
  error?: string;
  type?: string;
  disabled?: boolean;
};

export default function Input({
  label,
  placeholder,
  error,
  type = "text",
  disabled = false,
}: InputProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={clsx(
          "w-full px-4 py-2 rounded-lg border transition-all outline-none",
          "bg-white text-neutral-900 placeholder-neutral-400",
          "focus:ring-2 focus:ring-primary-500 focus:border-primary-500",

          {
            "border-neutral-300": !error,
            "border-danger-500 focus:ring-danger-500 focus:border-danger-500":
              error,
          },

          disabled && "bg-neutral-100 opacity-60 cursor-not-allowed"
        )}
      />

      {error && (
        <p id={errorId} className="text-xs text-danger-600">
          {error}
        </p>
      )}
    </div>
  );
}
