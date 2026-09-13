"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

import { mediaSrc } from "@/data/vehicles";
import styles from "../vehicles/[slug]/page.module.css";

type VehicleGalleryProps = {
  images: string[];
  title: string;
};

/**
 * The car's photographs.
 *
 * Built on CSS scroll-snap rather than a carousel library, and that is the
 * whole performance story: the browser does the scrolling and the snapping
 * itself, on the compositor, so a swipe never waits on JavaScript and never
 * drops a frame behind a re-render. Touch, trackpad and momentum all come for
 * free because it is a real scroll container. The arrows only call scrollTo;
 * nothing here animates anything by hand, and no library is downloaded to do
 * what the platform already does better.
 *
 * Which slide is showing is read with an IntersectionObserver rather than a
 * scroll listener, so the common case -- a finger dragging -- costs nothing
 * per frame.
 */
export function VehicleGallery({ images, title }: VehicleGalleryProps) {
  const photos = useMemo(() => Array.from(new Set(images)).filter(Boolean), [images]);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) {
      return;
    }
    // scrollTo on the container, not scrollIntoView on the slide: the latter
    // also scrolls the page vertically to bring the gallery into view, which
    // yanks the reader away from whatever they were looking at.
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || photos.length < 2) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(index)) {
              setActive(index);
            }
          }
        }
      },
      // Against the track itself, and only when a slide is more than half in
      // view -- so the count flips once per swipe rather than twice.
      { root: track, threshold: 0.55 },
    );

    for (const slide of Array.from(track.children)) {
      observer.observe(slide);
    }

    return () => observer.disconnect();
  }, [photos.length]);

  if (photos.length === 0) {
    return (
      <div className={styles.singlePhotoNote}>
        <ImageIcon aria-hidden="true" />
        <span>
          <strong>No photographs yet.</strong> Ask us for a walkaround of this vehicle.
        </span>
      </div>
    );
  }

  const single = photos.length === 1;

  return (
    <div className={styles.gallery}>
      <div className={styles.carousel}>
        <div
          ref={trackRef}
          className={styles.carouselTrack}
          // A real scroll container, so it is focusable and arrow keys work
          // without us reimplementing them.
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label={`${title} photographs`}
        >
          {photos.map((image, index) => (
            <div
              key={`${image}-${index}`}
              data-index={index}
              className={styles.carouselSlide}
              role="group"
              aria-roledescription="slide"
              aria-label={`Photo ${index + 1} of ${photos.length}`}
            >
              <Image
                src={mediaSrc(image)}
                alt={index === 0 ? title : ""}
                fill
                sizes="(max-width: 980px) 100vw, 62vw"
                className={styles.mainImage}
                // The first photograph is the largest thing on the page and
                // the reason the page was opened; the rest wait until they
                // are nearly in view.
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
              />
            </div>
          ))}
        </div>

        {!single && (
          <>
            <button
              type="button"
              className={`${styles.carouselArrow} ${styles.carouselPrev}`}
              onClick={() => scrollTo(Math.max(active - 1, 0))}
              disabled={active === 0}
              aria-label="Previous photo"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`${styles.carouselArrow} ${styles.carouselNext}`}
              onClick={() => scrollTo(Math.min(active + 1, photos.length - 1))}
              disabled={active === photos.length - 1}
              aria-label="Next photo"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </>
        )}

        <span className={styles.photoCount}>
          <Camera aria-hidden="true" />
          {single
            ? "1 verified photo"
            : `${active + 1} / ${photos.length} verified photos`}
        </span>
      </div>

      {!single && (
        <div className={styles.thumbnailRow} aria-label="Vehicle photos">
          {photos.map((image, index) => (
            <button
              key={`thumb-${image}-${index}`}
              type="button"
              className={index === active ? styles.thumbnailActive : ""}
              onClick={() => scrollTo(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={index === active}
            >
              <Image src={mediaSrc(image)} alt="" fill sizes="120px" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {single && (
        <div className={styles.singlePhotoNote}>
          <ImageIcon aria-hidden="true" />
          <span>
            <strong>One verified photo is available.</strong> Request a full walkaround before
            purchase.
          </span>
        </div>
      )}
    </div>
  );
}
