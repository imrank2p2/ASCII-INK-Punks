type Props = {
  color?: string;
};

export default function SectionDivider({
  color = "#111",
}: Props) {
  return (
    <div className="relative h-12 overflow-hidden">

      <svg
        viewBox="0 0 1440 80"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40
             L80 20
             L160 50
             L240 15
             L320 45
             L400 20
             L480 55
             L560 18
             L640 48
             L720 22
             L800 52
             L880 18
             L960 48
             L1040 20
             L1120 55
             L1200 15
             L1280 45
             L1360 22
             L1440 40
             L1440 80
             L0 80Z"
          fill={color}
        />
      </svg>

    </div>
  );
}