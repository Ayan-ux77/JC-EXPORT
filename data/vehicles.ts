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

  price: number;
  currency?: string;

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

  auctionGrade: number;
  auctionGradeLabel?: string;
  condition: string;

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

export function formatVehiclePrice(vehicle: Pick<Vehicle, "price" | "currency">) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: vehicle.currency || "USD",
    maximumFractionDigits: 0,
  }).format(vehicle.price);
}

export function isRemoteVehicleMedia(value: string) {
  return /^https?:\/\//i.test(value);
}

/*
 * The demo vehicle list that used to live here has been deleted.
 *
 * It was served silently whenever the ERP was unreachable, which meant the
 * public site could advertise cars that do not exist. An enquiry about one
 * costs a real conversation and the buyer's trust; an honest "listings are
 * temporarily unavailable" costs neither.
 */
