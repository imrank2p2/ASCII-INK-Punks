import { ReactNode } from "react";
import clsx from "clsx";
import Container from "./Container";
import HalftoneBackground from "./HalftoneBackground";

type Props = {
  children: ReactNode;
  className?: string;
  background?: string;
  dots?: boolean;
  id?: string;
};

export default function ComicSection({
  children,
  className,
  background = "#F8D43A",
  dots = false,
  id,
}: Props) {
  return (
    <section
      id={id}
      className={clsx(
        "relative overflow-hidden border-y-4 border-black",
        className
      )}
      style={{ background }}
    >
      {dots && <HalftoneBackground />}

      <Container className="relative py-24">
        {children}
      </Container>
    </section>
  );
}