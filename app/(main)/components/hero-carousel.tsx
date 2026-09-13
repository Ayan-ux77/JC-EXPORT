"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";

import { HERO_SLIDE_MS, heroFocal, heroSlides } from "@/data/hero";

import styles from "./hero-carousel.module.css";

/**
 * The home page banner's photographs, cross-faded rather than scrolled.
 *
 * A background slideshow has different constraints from the gallery on a
 * vehicle page. Nothing here is content the visitor came for -- the headline
 * and the search panel are -- so the images are decorative, the transition
 * must not shift a single pixel of layout, and the whole thing has to be
 * stoppable. Specifically:
 *
 *  - Only the first slide is `priority`. It is the LCP element, and marking
 *    all three would have the browser race three 400KB fetches for one
 *    visible pixel each. The rest mount after first paint.
 *  - Auto-advance stops while the tab is hidden, while a pointer is over the
 *    banner, while focus is inside it, and permanently once the visitor hits
 *    pause. Timing out invisibly in a background tab would otherwise leave a
 *    burst of queued transitions when they came back.
 *  - `prefers-reduced-motion: reduce` disables the rotation entirely, leaving
 *    a still first slide. WCAG 2.2.2 also wants a control even for those who
 *    have not set that preference, which is what the pause button is for.
 */
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Never changes after hydration, so there is nothing to subscribe to. */
const subscribeNever = () => () => {};

const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Both of these are properties of the browser, not of React state, so they
  // are read through useSyncExternalStore: it gives the server a defined
  // snapshot (no rotation, no controls) and swaps to the real value on
  // hydration without a mismatch or a setState-in-effect cascade.
  const interactive = useSyncExternalStore(subscribeNever, () => true, () => false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
  // The non-first slides are held back until after first paint so they cannot
  // compete with the LCP image for bandwidth.
  const [mountRest, setMountRest] = useState(false);
  const hovering = useRef(false);

  useEffect(() => {
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => setMountRest(true), { timeout: 2000 })
      : window.setTimeout(() => setMountRest(true), 400);
    return () => {
      if (window.cancelIdleCallback && typeof idle === "number") {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle as number);
      }
    };
  }, []);

  const advance = useCallback(() => {
    setIndex((current) => (current + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || heroSlides.length < 2) {
      return;
    }

    let timer = 0;
    const start = () => {
      window.clearTimeout(timer);
      // A fresh full interval each time, so jumping to a slide by hand does
      // not leave it on screen for whatever was left of the previous one.
      timer = window.setTimeout(advance, HERO_SLIDE_MS);
    };
    const stop = () => window.clearTimeout(timer);

    const onVisibility = () => {
      if (document.visibilityState === "hidden" || hovering.current) {
        stop();
      } else {
        start();
      }
    };

    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // `index` is a dependency on purpose: each change restarts the timer.
  }, [advance, index, paused, reducedMotion]);

  const hold = useCallback((value: boolean) => {
    hovering.current = value;
    // Nudges the effect above through its visibilitychange path without a
    // re-render per pointer move.
    document.dispatchEvent(new Event("visibilitychange"));
  }, []);

  return (
    <div
      className={styles.stack}
      onMouseEnter={() => hold(true)}
      onMouseLeave={() => hold(false)}
      onFocusCapture={() => hold(true)}
      onBlurCapture={() => hold(false)}
    >
      {heroSlides.map((slide, position) => {
        // Slide 0 always renders; the rest wait for idle time.
        if (position > 0 && !mountRest) {
          return null;
        }
        return (
          <Image
            key={slide.src}
            src={slide.src}
            alt=""
            aria-hidden="true"
            fill
            priority={position === 0}
            loading={position === 0 ? undefined : "lazy"}
            sizes="100vw"
            style={heroFocal(slide)}
            className={`${styles.slide} ${position === index ? styles.slideActive : ""}`}
          />
        );
      })}

      {/* Rendered only once the client has taken over: without JavaScript the
          buttons would do nothing and the banner is a still image anyway. */}
      {interactive && heroSlides.length > 1 && (
        <div className={styles.controls}>
          {!reducedMotion && (
            <button
              type="button"
              className={styles.pause}
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? "Resume banner slideshow" : "Pause banner slideshow"}
            >
              {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
            </button>
          )}
          <div className={styles.dots}>
            {heroSlides.map((slide, position) => (
              <button
                key={slide.src}
                type="button"
                className={position === index ? styles.dotActive : styles.dot}
                aria-label={slide.label}
                aria-current={position === index ? "true" : undefined}
                onClick={() => {
                  setMountRest(true);
                  setIndex(position);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
