import { HTMLAttributes } from "react";
import clsx from "clsx";

type Props = HTMLAttributes<HTMLDivElement> & {
  color?: "white" | "yellow" | "pink" | "blue" | "green";
};

export default function ComicCard({
  color = "white",
  className,
  children,
  ...props
}: Props) {
  const colors = {
    white: "bg-white",
    yellow: "bg-yellow-300",
    pink: "bg-pink-500 text-white",
    blue: "bg-sky-300",
    green: "bg-lime-300",
  };

  return (
    <div
      {...props}
      className={clsx(
        "border-4 border-black",
        "shadow-[8px_8px_0_#000]",
        "transition-all duration-150",
        "hover:-translate-y-1",
        colors[color],
        className
      )}
    >
      {children}
    </div>
  );
}