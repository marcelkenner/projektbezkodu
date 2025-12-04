import Image from "next/image";
import { Breadcrumbs } from "@/app/ui";
import type { BreadcrumbItem } from "@/app/lib/navigation/BreadcrumbComposer";
import styles from "./content-hero.module.css";

interface HeroImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface ContentHeroProps {
  heading: string;
  subheading?: string;
  breadcrumbs: BreadcrumbItem[];
  image?: HeroImage | null;
}

export function ContentHero({
  heading,
  subheading,
  breadcrumbs,
  image,
}: ContentHeroProps) {
  return (
    <div className={styles.hero}>
      <div className={styles.media} aria-hidden={true}>
        {image ? (
          <Image
            src={image.src}
            alt=""
            width={image.width ?? 1600}
            height={image.height ?? 900}
            className={styles.image}
            priority
            sizes="100vw"
          />
        ) : (
          <div className={styles.placeholder} />
        )}
        <div className={styles.overlay} />
      </div>
      <div className="pbk-container">
        <div className={styles.content}>
          <Breadcrumbs items={breadcrumbs} />
          <h1>{heading}</h1>
          {subheading ? (
            <p className={styles.subheading}>{subheading}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
