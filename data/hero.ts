import type { CSSProperties } from "react";

/**
 * The banner photographs. The home page cross-fades through the whole list;
 * the about and services banners are static and use the first entry.
 *
 * Every asset in `public/hero/` is pre-cropped to a 2.2:1 band, because the
 * banner only ever shows a wide horizontal strip and shipping the full frame
 * meant sending thousands of pixels of height nobody sees. Adding a slide is
 * a matter of cropping to the same ratio, dropping it in `public/hero/`, and
 * appending an entry here.
 *
 * The three focal points are the point the browser keeps in frame when it
 * crops the photo to the banner's ratio; each is separate because the desktop
 * banner, the narrower mobile banner and a taller source all crop
 * differently. They feed `--hero-focal-x`, `--hero-focal-x-mobile` and
 * `--hero-focal-y`, set per slide so each photograph can be aimed on its own.
 */
export type HeroSlide = {
  src: string;
  /**
   * Describes the photograph. The image stack itself is decorative -- the
   * headline carries the meaning -- so this is not an `alt`; it labels the
   * slide's dot for anyone navigating by keyboard or screen reader.
   */
  label: string;
  focalX: string;
  focalXMobile: string;
  focalY: string;
};

export const heroSlides: readonly HeroSlide[] = [
  {
    // Japanese stock in a Japanese port yard: a Corolla Axio, a RAV4 and a
    // Vitz with auction stickers still on the screens, a car carrier berthed
    // behind them. It is the only one of the candidates that shows the actual
    // business, so it leads.
    src: "/hero/port-yard.webp",
    label: "Japanese used vehicles in a port yard with a car carrier berthed behind",
    // The cars sit right of centre, so the desktop crop leans right to keep
    // them out from behind the headline. The phone crop sees only ~40% of the
    // width, and at 72% that was the loading shed rather than the cars.
    focalX: "68%",
    focalXMobile: "55%",
    focalY: "55%",
  },
  {
    // Photograph by Tobias Tullius, Unsplash (unsplash.com/photos/xP5an6iXcf0),
    // Unsplash Licence. Cropped from a portrait original that is not in this repo.
    src: "/hero/car-carrier-deck.webp",
    label: "Vehicles secured on the deck of a car carrier at sea",
    // The deck runs the full width, so there is no subject to push clear of
    // the headline. The desktop banner is wider than the asset (2.74:1
    // against 2.2:1) and fills on width, so focalX only bites on mobile,
    // which sees about 40% of the width.
    focalX: "50%",
    focalXMobile: "50%",
    focalY: "50%",
  },
];

/*
 * Two more candidates are cropped and sitting in `public/hero/`, deliberately
 * left out of the rotation:
 *
 *   vehicle-yard.webp  -- Bingqian Li, Pexels (pexels.com/photo/27667814). A
 *     French yard: French plates, "CARROSSERIE" on the building, Renault and
 *     Peugeot stock. Wrong market to put on a Japanese exporter's banner.
 *   yard-aerial.webp   -- Viktoria B, Pexels (pexels.com/photo/5231181). A
 *     North American parking lot from above. Nothing in it says export.
 *
 * Both are one entry away from going in if the brief changes, but two slides
 * that both tell the right story beat four that do not.
 */

/** The static banner used by the about and services pages. */
export const heroImage = heroSlides[0];

/** How long each slide holds before the next one fades in. */
export const HERO_SLIDE_MS = 6500;

/**
 * Spread onto an element so the CSS can read a slide's focal points.
 * Typed loosely on purpose: custom properties are not part of React's
 * CSSProperties, and casting here beats casting at each use.
 */
export function heroFocal(slide: HeroSlide): CSSProperties {
  return {
    "--hero-focal-x": slide.focalX,
    "--hero-focal-x-mobile": slide.focalXMobile,
    "--hero-focal-y": slide.focalY,
  } as CSSProperties;
}

/** Convenience for the single-image banners. */
export const heroFocalStyle = heroFocal(heroSlides[0]);
