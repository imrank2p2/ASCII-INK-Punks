type Props = {
  className?: string;
};

export default function HalftoneBackground({
  className = "",
}: Props) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 opacity-20 ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(#111 1px, transparent 1px)",
        backgroundSize: "14px 14px",
      }}
    />
  );
}