"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Camera, ImageIcon } from "lucide-react";

import { mediaSrc } from "@/data/vehicles";
import styles from "../vehicles/[slug]/page.module.css";

type VehicleGalleryProps = {
  images: string[];
  title: string;
};

export function VehicleGallery({ images, title }: VehicleGalleryProps) {
  const uniqueImages = useMemo(() => Array.from(new Set(images)), [images]);
  const [activeImage, setActiveImage] = useState(0);
  const currentImage = uniqueImages[activeImage] ?? images[0];

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageFrame}>
        <Image
          src={mediaSrc(currentImage)}
          alt={title}
          fill
          sizes="(max-width: 980px) 100vw, 62vw"
          className={styles.mainImage}
        />
        <span className={styles.photoCount}>
          <Camera aria-hidden="true" /> {uniqueImages.length} verified photo{uniqueImages.length === 1 ? "" : "s"}
        </span>
      </div>

      {uniqueImages.length > 1 ? (
        <div className={styles.thumbnailRow} aria-label="Vehicle photos">
          {uniqueImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={index === activeImage ? styles.thumbnailActive : ""}
              onClick={() => setActiveImage(index)}
              aria-label={`Show vehicle photo ${index + 1}`}
              aria-pressed={index === activeImage}
            >
              <Image
                src={mediaSrc(image)}
                alt=""
                fill
                sizes="120px"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.singlePhotoNote}>
          <ImageIcon aria-hidden="true" />
          <span><strong>One verified photo is available.</strong> Request a full walkaround before purchase.</span>
        </div>
      )}
    </div>
  );
}
