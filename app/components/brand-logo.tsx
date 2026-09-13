import Image from "next/image";
import styles from "./brand-logo.module.css";

// tone picks which lockup reads correctly against the surface behind it —
// the dark wordmark disappears on the navy footer and the light one
// disappears on the white header, so the two are never interchangeable.
const LOCKUPS = {
  "on-light": "/brand/japan-car-export-horizontal.png",
  "on-dark": "/brand/japan-car-export-horizontal-light.png",
} as const;

// The source lockup is 1207x325. Each size keeps that ratio so next/image
// never has to stretch it, and the fixed dimensions stop the header/footer
// from reflowing while the file loads.
const DIMENSIONS = {
  compact: { width: 104, height: 28 },
  default: { width: 156, height: 42 },
  footer: { width: 126, height: 34 },
} as const;

type BrandLogoProps = {
  tone?: keyof typeof LOCKUPS;
  size?: keyof typeof DIMENSIONS;
};

export function BrandLogo({ tone = "on-light", size = "default" }: BrandLogoProps) {
  const { width, height } = DIMENSIONS[size];

  return (
    <Image
      src={LOCKUPS[tone]}
      alt="Japan Car Export"
      width={width}
      height={height}
      className={styles.logo}
      priority={size === "default"}
    />
  );
}
