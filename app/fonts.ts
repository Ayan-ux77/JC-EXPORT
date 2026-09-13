import { Noto_Sans, Source_Serif_4 } from "next/font/google";

/**
 * The site's two typefaces, declared once.
 *
 * They used to be declared again in every page file, which meant nine places
 * to keep in step and nine chances for one page to quietly wear a different
 * face than the rest.
 *
 * Display is a serif on purpose. The exporters this site competes with are
 * uniformly utilitarian, and a serif headline is the cheapest way to look
 * like a company rather than a stock feed. Source Serif is the steady kind:
 * it holds up at headline sizes without the mannerism of a display-only face,
 * and it is still readable at 15px when it turns up in a pull quote.
 */
export const displayFont = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

/**
 * Noto Sans for body text, because of the language switcher in the header.
 *
 * Only the Latin subset is downloaded -- shipping full Arabic and Japanese
 * webfonts to every visitor for the two words "اردو" and "日本語" would cost
 * more than it is worth. But naming Noto's Arabic and Japanese siblings in
 * the stack means a reader whose device has them (most do) sees type that
 * belongs to the same family rather than an unrelated system fallback.
 */
export const bodyFont = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
  fallback: ["Noto Sans Arabic", "Noto Sans JP", "Helvetica Neue", "Arial", "sans-serif"],
});

/** Every page spreads this onto its root element. */
export const fontVariables = `${bodyFont.variable} ${displayFont.variable}`;
