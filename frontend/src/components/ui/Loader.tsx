import clsx from "clsx";

type LoaderProps = {
  size?: "lg" | "sm" | "xs";
};

export default function Loader({ size = "sm" }: LoaderProps) {
  return (
    <div role="status" aria-label="Loading">
      <div
        className={clsx(
          "animate-spin rounded-full border-2 border-primary-200 border-t-primary-600",
          {
            "w-10 h-10": size === "lg",
            "w-6 h-6": size === "sm",
            "w-4 h-4": size === "xs",
          }
        )}
      />
      <span className="sr-only">Loading</span>
    </div>
  );
}
