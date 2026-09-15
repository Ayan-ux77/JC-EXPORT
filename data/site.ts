/**
 * Who the company is and how to reach it, in one place.
 *
 * These details were written out by hand in six files, with two different
 * addresses for the same inbox and a WhatsApp number typed into three
 * components that each ignored the environment variable already holding it.
 * Changing a phone number meant finding every copy.
 *
 * Everything here is NEXT_PUBLIC_ because the contact links render on the
 * client too. Each is read as a literal `process.env.NEXT_PUBLIC_X` so Next
 * can inline it at build time -- a computed lookup would come back undefined
 * in the browser.
 */

const RAW_PHONE = process.env.NEXT_PUBLIC_PHONE?.trim() || "";
const RAW_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "";

export const site = {
  name: "Japan Car Export",
  domain: "jcexport.jp",

  /** Absolute origin, used for canonical URLs and the API's origin allow list. */
  url: (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://jcexport.jp").replace(/\/+$/, ""),

  salesEmail: process.env.NEXT_PUBLIC_SALES_EMAIL?.trim() || "sales@jcexport.jp",

  /**
   * The number as it should be printed, in international format. Null when it
   * is not configured -- and every phone affordance hides itself rather than
   * falling back to an invented number, which would be worse than silence:
   * a made-up number is a real number belonging to somebody else.
   */
  phone: RAW_PHONE || null,

  /** The same number as a dialable href, punctuation stripped. */
  phoneHref: RAW_PHONE ? `tel:${RAW_PHONE.replace(/[^\d+]/g, "")}` : null,

  whatsappNumber: RAW_WHATSAPP || null,

  /**
   * Where the people answering are. The contact page had "Peshawar office /
   * Pakistan" written into it, which reads oddly beside a jcexport.jp domain
   * and a Japanese sourcing story -- but it is not mine to guess at, so it
   * comes from the environment with a truthful, unspecific default.
   */
  officeLabel: process.env.NEXT_PUBLIC_OFFICE_LABEL?.trim() || "Export desk",
  officeLocation: process.env.NEXT_PUBLIC_OFFICE_LOCATION?.trim() || "Japan",
} as const;

export function mailto(subject?: string): string {
  return subject
    ? `mailto:${site.salesEmail}?subject=${encodeURIComponent(subject)}`
    : `mailto:${site.salesEmail}`;
}

/**
 * A WhatsApp deep link, or null when no number is configured -- this trade
 * runs on WhatsApp, but a button that opens an empty chat is worse than no
 * button at all.
 */
export function whatsapp(message?: string): string | null {
  // wa.me wants digits and nothing else. The number in .env is written the
  // way a person writes it -- "+81 345 20 8932" -- and pasting that straight
  // into the URL produces a link that opens WhatsApp on a number it cannot
  // parse. Strip it here rather than asking whoever edits .env to remember,
  // because they will not, and the failure is silent.
  const digits = site.whatsappNumber?.replace(/\D/g, "") ?? "";

  if (!digits) {
    return null;
  }

  return message
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${digits}`;
}
