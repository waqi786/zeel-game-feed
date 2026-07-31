import clsx from "clsx";

type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizes = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-28 w-28"
};

export function LogoMark({ size = "md", className }: Props) {
  return (
    <span
      className={clsx(
        "grid shrink-0 place-items-center overflow-hidden rounded-full border border-zeel-primary/80 bg-transparent shadow-[0_0_22px_rgba(245,5,117,.42)]",
        sizes[size],
        className
      )}
    >
      <img src="/zeel-logo.png" className="h-[82%] w-[82%] object-contain" alt="" />
    </span>
  );
}
