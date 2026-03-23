import clsx from "clsx";

type ButtonProps = {
  variant?: "primary" | "secondary" | "danger" | "outlined";
  size?: "lg" | "sm" | "xs";
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  variant = "primary",
  size = "sm",
  disabled = false,
  children,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "rounded-lg font-semibold transition-all duration-200",
        "flex items-center justify-center",
        "shadow-xs hover:shadow-sm active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-primary-500",

        // sizes
        {
          "px-6 py-3 text-base": size === "lg",
          "px-4 py-2 text-sm": size === "sm",
          "px-3 py-1 text-xs rounded-md": size === "xs",
        },

        // variants
        {
          "bg-primary-600 text-white hover:bg-primary-700":
            variant === "primary",

          "bg-neutral-100 text-neutral-800 hover:bg-neutral-200":
            variant === "secondary",

          "bg-danger-600 text-white hover:bg-danger-700":
            variant === "danger",

          "border border-neutral-300 text-neutral-800 hover:bg-neutral-50 bg-transparent":
            variant === "outlined",
        },

        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      {children}
    </button>
  );
}
