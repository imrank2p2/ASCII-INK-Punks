type Props = {
  value: string;
  label: string;
  color?: "pink" | "blue" | "green" | "orange";
};

export default function ComicStat({
  value,
  label,
  color = "pink",
}: Props) {
  const colors = {
    pink: "bg-pink-500",
    blue: "bg-sky-300",
    green: "bg-lime-300",
    orange: "bg-orange-300",
  };

  return (
    <div
      className={`${colors[color]} border-4 border-black p-8 text-center shadow-[6px_6px_0_#000]`}
    >
      <h3 className="text-4xl font-black">
        {value}
      </h3>

      <p className="mt-2 font-bold uppercase">
        {label}
      </p>
    </div>
  );
}