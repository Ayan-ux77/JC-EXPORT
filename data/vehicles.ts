import { whatsapp } from "./site";

export type LandedCost = {
  port: string;
  fob: number;
  freight: number | null;
  insurance: number | null;
  total: number | null;
  currency: string;
  // False when JC has no freight rate for this route. The UI must say so
  // ("ask us for a freight quote") rather than present the FOB figure as if
  // it were a landed price -- that is a number the buyer would hold JC to.
  priced: boolean;
  shipment_type: string;
};

export type Vehicle = {
  id: number | string;
  slug: string;
  image: string;
  images: string[];

  brand: string;
  model: string;
  bodyType: string;

  year: number;
  title: string;
  mileage: string;
  mileageKm: number;

  engine: string;
  fuel: string;

  // Null when the car has no published asking price -- the ERP calls this
  // "price on application" and the API sends price and currency as null
  // together. The type has to say so, or every call site formats a null and
  // Intl.NumberFormat throws on the currency rather than the number.
  price: number | null;
  currency?: string | null;

  transmission: string;
  drivetrain: string;
  color: string;
  interior: string;
  steering: string;

  doors: number;
  seats: number;

  stock: string;
  location: string;
  stockCategory?: "Regular Stock" | "Engine Stock" | "Third-Party Stock";
  sourceMarket?: "Japan" | "Taiwan" | "China" | "Other";
  ownershipType?: "Company Owned" | "Consignment" | "Customer Owned";

  freight: number;
  insurance: number;

  // Null when the car has no recorded auction grade -- an unscored trade-in,
  // say. The listing must not print "Grade null"; it must simply omit the
  // badge, because a grade is trust evidence and absence of evidence is not
  // evidence of a low grade.
  auctionGrade: number | null;
  auctionGradeLabel?: string;
  condition: string;

  // Present only when the caller asked for a destination port. Null means
  // either no destination was requested, or the car's price is not public
  // (a price-on-application car cannot be quoted a landed cost either).
  landed: LandedCost | null;

  // ISO date the unit was listed. Drives the "New arrival" badge and the
  // default "recently listed first" sort -- repeat buyers come back to see
  // what landed since their last visit.
  listedAt: string;

  description: string;
  conditionSummary?: string;
  damageNotes?: string;
  inspectionResult?: string;
  availability?: "Available" | "Reserved";
  publicationStatus?: string;
  operationalStatus?: string;
  isFeatured?: boolean;
  chassis?: string;
  features?: Array<{
    category: string;
    name: string;
    details?: string;
    highlighted?: boolean;
  }>;
  damages?: Array<{
    area: string;
    severity: string;
    description: string;
    photo?: string;
    repairStatus: string;
  }>;
  documents?: Array<{
    type: string;
    number?: string;
    file: string;
    notes?: string;
  }>;
};

/** What the site shows where a price would go when JC has not published one. */
export const PRICE_ON_APPLICATION = "Price on application";

export function hasPublicPrice(vehicle: Pick<Vehicle, "price">): boolean {
  return vehicle.price != null;
}

export function formatVehiclePrice(vehicle: Pick<Vehicle, "price" | "currency">) {
  return formatCurrency(vehicle.price, vehicle.currency);
}

/**
 * Shared money formatting so a landed total and an FOB price never drift in
 * style. A missing amount is spelled out rather than rendered as $0 -- a car
 * with no published price is not a free car -- and a missing currency code
 * falls back instead of throwing, since one unpriced unit in the feed used to
 * take the whole listing page down with it.
 */
export function formatCurrency(value: number | null | undefined, currency?: string | null) {
  if (value == null) {
    return PRICE_ON_APPLICATION;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Turn an ERP photo URL into a path on this site.
 *
 * jc-portal hands out absolute URLs on its own origin. Served that way the
 * browser makes a cross-origin request to a second port, and Next's image
 * optimiser refuses the host outright whenever it resolves to a private
 * address. `/media/...` is rewritten back to the ERP server-side (see
 * next.config.ts), so the photo arrives as a local image on this origin.
 *
 * Anything that is not an ERP media path is handed back untouched.
 */
export function mediaSrc(url: string): string {
  if (!url) {
    return url;
  }
  try {
    const { pathname } = new URL(url);
    return pathname.startsWith("/storage/") ? `/media${pathname.slice("/storage".length)}` : url;
  } catch {
    // Already a relative path -- a local placeholder, say.
    return url;
  }
}

const NEW_ARRIVAL_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * A car counts as a "new arrival" for 14 days after listing. Buyers who
 * compare this site against BE FORWARD and SBT week over week come back to
 * see what is new; this is the signal that answers that visit.
 */
export function isNewArrival(listedAt: string | undefined): boolean {
  if (!listedAt) return false;
  const listedTime = new Date(listedAt).getTime();
  if (Number.isNaN(listedTime)) return false;
  const age = Date.now() - listedTime;
  return age >= 0 && age <= NEW_ARRIVAL_WINDOW_MS;
}

/**
 * This trade runs on WhatsApp, not contact forms -- a buyer in Mombasa
 * expects to type "do you still have JC-0042?" into a chat, not fill a form
 * and wait for email. Returns null when no number is configured so callers
 * can hide the button entirely rather than render a link that goes nowhere.
 */
export function whatsappUrl(vehicle: Pick<Vehicle, "stock" | "title">): string | null {
  return whatsapp(`Hello, I am interested in ${vehicle.stock} (${vehicle.title}).`);
}

/*
 * The demo vehicle list that used to live here has been deleted.
 *
 * It was served silently whenever the ERP was unreachable, which meant the
 * public site could advertise cars that do not exist. An enquiry about one
 * costs a real conversation and the buyer's trust; an honest "listings are
 * temporarily unavailable" costs neither.
 */
