import type { Metadata } from "next";
import { bodyFont, displayFont } from "@/app/fonts";
import Image from "next/image";
import Link from "next/link";

import { SelectField } from "@/app/components/select-field";
import { mediaSrc } from "@/data/vehicles";
import { mailto, site, whatsapp } from "@/data/site";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Ship,
  SlidersHorizontal,
} from "lucide-react";

import {
  getModelsForMake,
  getReviews,
  getVehiclePage,
  getVehicles,
} from "@/data/vehicle-service";
import { FeaturedVehicles } from "./components/featured-vehicles";
import { HomeInquiryForm } from "./components/home-inquiry-form";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Japanese Used Cars for Export | Japan Car Export",
  description:
    "Browse inspected Japanese used vehicles with clear FOB pricing, export documentation, and worldwide shipping support.",
};

const stats = [
  { value: "15+", label: "Years exporting" },
  { value: "4,200+", label: "Vehicles shipped" },
  { value: "32", label: "Countries served" },
  { value: "98%", label: "Returning clients" },
];

const heroProof = [
  "Auction sheet reviewed",
  "Mileage and chassis checked",
  "FOB price shown clearly",
];

const brands = [
  { name: "Honda", logo: "/Home/honda-svgrepo-com 2.svg" },
  { name: "Toyota", logo: "/Home/toyota-svgrepo-com 2.svg" },
  { name: "Mazda", logo: "/Home/mazda-svgrepo-com 2.svg" },
  { name: "Nissan", logo: "/Home/nissan.svg" },
  { name: "Isuzu", logo: "/Home/isuzu-2 2.svg" },
  { name: "BMW", logo: "/Home/bmw-logo-svgrepo-com 3.svg" },
  { name: "Mitsubishi", logo: "/Home/mitsubishi-svgrepo-com 2.svg" },
  { name: "Subaru", logo: "/Home/subaru-alt-svgrepo-com 2.svg" },
  { name: "Daihatsu", logo: "/Home/Vector.svg" },
  { name: "Suzuki", logo: "/Home/Vector (1).svg" },
];

/* The fixed choices the search band offers. Kept as data so the markup below
   reads as four identical fields rather than four hand-written option lists. */
const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Van", "Truck"];

const YEAR_OPTIONS = ["2021", "2019", "2017", "2015"];

const PRICE_CEILINGS = [
  { value: "5000", label: "Up to $5,000" },
  { value: "10000", label: "Up to $10,000" },
  { value: "20000", label: "Up to $20,000" },
  { value: "30000", label: "Up to $30,000" },
];

const processSteps = [
  {
    number: "01",
    icon: Search,
    title: "Source",
    description:
      "Choose from current stock or tell us the make, model, year, and budget you want sourced from Japan.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Verify",
    description:
      "We review the auction sheet, mileage, chassis details, photos, and condition before you commit.",
  },
  {
    number: "03",
    icon: Ship,
    title: "Ship",
    description:
      "Your vehicle is booked by RoRo or container with clear sailing details and shipping updates.",
  },
  {
    number: "04",
    icon: FileCheck2,
    title: "Clear",
    description:
      "The export certificate, invoice, bill of lading, and destination paperwork are prepared for arrival.",
  },
];

const companyFeatures = [
  "Japanese auction and dealer sourcing",
  "Independent inspection options",
  "Photo and video condition evidence",
  "RoRo and container shipping support",
  "Country-specific export documents",
  "Support before and after shipment",
];

const trustBadges = [
  {
    icon: ShieldCheck,
    title: "Condition first",
    subtitle: "Evidence before payment",
  },
  {
    icon: BadgeCheck,
    title: "Clear pricing",
    subtitle: "FOB and shipping separated",
  },
  {
    icon: Clock3,
    title: "15+ years",
    subtitle: "Export experience",
  },
  {
    icon: Globe2,
    title: "Global support",
    subtitle: "32 destination markets",
  },
];

/* Whatever is actually configured. An unset number drops out of the list
   rather than printing a placeholder somebody might dial. */
const contactInfo = [
  site.whatsappNumber && {
    icon: MessageCircle,
    label: "WhatsApp",
    value: site.whatsappNumber,
    href: whatsapp(),
  },
  site.phone && {
    icon: Phone,
    label: "Direct phone",
    value: site.phone,
    href: site.phoneHref,
  },
  {
    icon: Mail,
    label: "Email",
    value: site.salesEmail,
    href: mailto(),
  },
  {
    icon: MapPin,
    label: "Export support",
    value: "Japan-sourced vehicles, worldwide delivery",
  },
].filter(Boolean) as Array<{
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string | null;
}>;

/** "James Mwangi" -> "JM". One letter when there is only one word. */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function HomePage() {
  // The hero's quick search (make + model) and its stock count both read
  // straight off the same listing this fetches with limit 1 -- one round
  // trip for the total, not a full page of vehicles just to read its meta.
  // Models are unfiltered (getModelsForMake("")) because the hero form is
  // a plain GET <form>, not a client component: there is no make-selected
  // event to chain a model list off without JavaScript.
  const [vehicles, stock, models, reviews] = await Promise.all([
    getVehicles({ featuredOnly: true, limit: 6 }),
    getVehiclePage({ limit: 1 }),
    getModelsForMake(""),
    getReviews(3),
  ]);
  const stockCount = stock.total;

  /**
   * The three cars the "see the actual vehicle" collage shows.
   *
   * That section's whole claim is that the photography is of real stock, so
   * filling it with stock photography would quietly contradict it. These are
   * live units, each one clickable through to its own page -- the claim and
   * the proof are the same object. The bundled photographs stay as a fallback
   * for a catalogue too small to fill the frame.
   */
  const showcase = vehicles
    .filter((vehicle) => Boolean(vehicle.image))
    // Distinct photographs, not distinct cars: two units can share a picture
    // (a dealer photographing a row of the same model, or demo data reusing a
    // stub), and a collage that shows the same car twice quietly argues
    // against the very line printed across it.
    .filter(
      (vehicle, index, all) =>
        all.findIndex((other) => other.image === vehicle.image) === index,
    )
    .slice(0, 3);

  return (
    <main
      className={`${styles.page} ${bodyFont.variable} ${displayFont.variable}`}
    >
      <section className={styles.hero} aria-labelledby="hero-title">
        <Image
          src="/home-hero.webp"
          alt="Used Japanese vehicles prepared for export at a port inspection yard"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />

        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span /> Japanese used vehicle specialists
            </p>
            <h1 id="hero-title">
              Verified Japanese used cars, <em>exported worldwide.</em>
            </h1>
            <p className={styles.heroDescription}>
              Source with confidence. We help buyers inspect, document, and ship
              quality used vehicles from Japan with clear pricing at every step.
            </p>

            <ul className={styles.heroProof}>
              {heroProof.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Field names match exactly what app/(main)/vehicles/page.tsx
                reads off the URL -- "make" and "model" -- so this plain GET
                form needs no JavaScript to hand off to a working search. */}
            <form
              className={styles.heroSearch}
              action="/vehicles"
              aria-label="Quick vehicle search"
            >
              <div className={styles.heroSearchField}>
                <span>Make</span>
                <SelectField
                  name="make"
                  tone="dark"
                  ariaLabel="Make"
                  placeholder="Any make"
                  options={brands.map((brand) => ({ value: brand.name, label: brand.name }))}
                />
              </div>
              <div className={styles.heroSearchField}>
                <span>Model</span>
                <SelectField
                  name="model"
                  tone="dark"
                  ariaLabel="Model"
                  placeholder="Any model"
                  options={models.map((model) => ({ value: model, label: model }))}
                />
              </div>
              <button type="submit" className={styles.heroSearchButton}>
                <Search aria-hidden="true" /> Find vehicles
              </button>
            </form>

            {/* Real inventory, not a marketing number -- stock.total comes
                from the same paginated endpoint the listing page uses, so
                this can never claim more cars than a buyer will actually
                find one click later. */}
            <p className={styles.heroStockCount}>
              <strong>{stockCount}</strong> vehicle{stockCount === 1 ? "" : "s"}{" "}
              in stock now
            </p>
          </div>
        </div>
      </section>

      <section
        className={styles.searchPanel}
        aria-labelledby="vehicle-search-title"
      >
        <div className={styles.searchHeading}>
          <div>
            <p className={styles.kicker}>Search current stock</p>
            <h2 id="vehicle-search-title">Find the right used vehicle</h2>
          </div>
          <Link href="/vehicles" className={styles.textLink}>
            Advanced search <SlidersHorizontal aria-hidden="true" />
          </Link>
        </div>

        {/* Names match the listing's own query params (year_from, price_max,
            body_type -- see app/(main)/vehicles/page.tsx) rather than the
            ad hoc ones this form used to submit, which the listing quietly
            ignored. */}
        <form className={styles.searchForm} action="/vehicles">
          <div className={styles.searchField}>
            <span>Make</span>
            <SelectField
              name="make"
              ariaLabel="Make"
              placeholder="All makes"
              options={brands.map((brand) => ({ value: brand.name, label: brand.name }))}
            />
          </div>
          <div className={styles.searchField}>
            <span>Body type</span>
            <SelectField
              name="body_type"
              ariaLabel="Body type"
              placeholder="All body types"
              options={BODY_TYPES.map((type) => ({ value: type, label: type }))}
            />
          </div>
          <div className={styles.searchField}>
            <span>Year from</span>
            <SelectField
              name="year_from"
              ariaLabel="Year from"
              placeholder="Any year"
              options={YEAR_OPTIONS.map((year) => ({ value: year, label: year }))}
            />
          </div>
          <div className={styles.searchField}>
            <span>Max FOB price</span>
            <SelectField
              name="price_max"
              ariaLabel="Max FOB price"
              placeholder="No limit"
              options={PRICE_CEILINGS}
            />
          </div>
          <button type="submit" className={styles.searchButton}>
            <Search aria-hidden="true" /> Search vehicles
          </button>
        </form>
      </section>

      <section
        className={styles.statsSection}
        aria-label="Japan Car Export in numbers"
      >
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.statItem}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.brandsSection} aria-labelledby="brands-title">
        <div className={styles.sectionIntroRow}>
          <div>
            <p className={styles.kicker}>Popular Japanese makes</p>
            <h2 id="brands-title">Start with a brand you trust</h2>
          </div>
          <p>
            Browse our latest stock or ask us to source a specific model from
            Japan.
          </p>
        </div>

        <div className={styles.brandsGrid}>
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/vehicles?brand=${brand.name.toLowerCase()}`}
              className={styles.brandItem}
              aria-label={`Browse ${brand.name} vehicles`}
            >
              <Image
                src={brand.logo}
                alt=""
                width={82}
                height={58}
                className={styles.brandLogo}
              />
              <span>{brand.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="vehicles"
        className={styles.vehiclesSection}
        aria-labelledby="vehicles-title"
      >
        <div className={styles.sectionIntroRow}>
          <div>
            <p className={styles.kicker}>Featured vehicles</p>
            <h2 id="vehicles-title">
              Hand-picked vehicles, <em>auction fresh.</em>
            </h2>
          </div>
          <Link href="/vehicles" className={styles.textLink}>
            View all vehicles <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <FeaturedVehicles vehicles={vehicles} />
      </section>

      <section
        id="services"
        className={styles.processSection}
        aria-labelledby="process-title"
      >
        <div className={styles.sectionIntroRow}>
          <div>
            <p className={styles.kicker}>How export works</p>
            <h2 id="process-title">
              From Japanese auction to <em>your destination.</em>
            </h2>
          </div>
          <p>
            A practical four-step process with one point of contact from vehicle
            selection through shipping documents.
          </p>
        </div>

        <div className={styles.processGrid}>
          {processSteps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.number} className={styles.processCard}>
                <div className={styles.processCardTop}>
                  <span>{step.number}</span>
                  <Icon aria-hidden="true" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="about"
        className={styles.aboutSection}
        aria-labelledby="about-title"
      >
        <div className={styles.aboutImageWrap}>
          {showcase.length === 3 ? (
            showcase.map((vehicle, index) => (
              <Link
                key={vehicle.slug}
                href={`/vehicles/${vehicle.slug}`}
                className={index === 0 ? styles.aboutImageMain : styles.aboutImageSmall}
                aria-label={`View ${vehicle.title}`}
              >
                <Image
                  src={mediaSrc(vehicle.image)}
                  alt={`${vehicle.title}, photographed in Japan before export`}
                  fill
                  sizes={
                    index === 0
                      ? "(max-width: 900px) 100vw, 48vw"
                      : "(max-width: 900px) 50vw, 24vw"
                  }
                  className={styles.aboutImage}
                />
                <span className={styles.aboutImageTag}>
                  {vehicle.title}
                  <small>Stock {vehicle.stock}</small>
                </span>
              </Link>
            ))
          ) : (
            <>
              <div className={styles.aboutImageMain}>
                <Image
                  src="/cards/4.png"
                  alt="Used vehicle photographed in Japan before export"
                  fill
                  sizes="(max-width: 900px) 100vw, 48vw"
                  className={styles.aboutImage}
                />
              </div>
              <div className={styles.aboutImageSmall}>
                <Image
                  src="/cards/1.png"
                  alt="White used hatchback in a Japanese vehicle yard"
                  fill
                  sizes="(max-width: 900px) 50vw, 24vw"
                  className={styles.aboutImage}
                />
              </div>
              <div className={styles.aboutImageSmall}>
                <Image
                  src="/cards/5.png"
                  alt="Black used sedan photographed before export"
                  fill
                  sizes="(max-width: 900px) 50vw, 24vw"
                  className={styles.aboutImage}
                />
              </div>
            </>
          )}
          <div className={styles.aboutImageCaption}>
            <span>Before you buy</span>
            <strong>See the actual vehicle, not a stock photo.</strong>
            {showcase.length === 3 && <em>Every photo here is a car in stock today.</em>}
          </div>
        </div>

        <div className={styles.aboutContent}>
          <p className={styles.kicker}>Why buyers choose Japan Car Export</p>
          <h2 id="about-title">
            More certainty before the car <em>leaves Japan.</em>
          </h2>
          <p className={styles.aboutLead}>
            Used-car exporting depends on evidence. We organize the condition
            details, costs, and documents you need to make a clear decision.
          </p>
          <p className={styles.aboutBody}>
            Whether you are buying one family vehicle or replenishing dealer
            stock, the process stays transparent: actual vehicle media, clear
            pricing, shipping options, and responsive support.
          </p>

          <ul className={styles.featureList}>
            {companyFeatures.map((feature) => (
              <li key={feature}>
                <Check aria-hidden="true" /> {feature}
              </li>
            ))}
          </ul>

          <Link href="/contact" className={styles.inlineButton}>
            Talk to an export specialist <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className={styles.trustSection} aria-label="Buyer assurances">
        <div className={styles.trustGrid}>
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.title} className={styles.trustItem}>
                <Icon aria-hidden="true" />
                <div>
                  <strong>{badge.title}</strong>
                  <span>{badge.subtitle}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {reviews.length > 0 && (
        <section
          id="stories"
          className={styles.testimonialsSection}
          aria-labelledby="stories-title"
        >
          <div className={styles.sectionIntroRow}>
            <div>
              <p className={styles.kicker}>Buyer stories</p>
              <h2 id="stories-title">
                Clear communication, <em>long after payment.</em>
              </h2>
            </div>
            <p>
              The strongest export relationship is built by keeping the buyer
              informed before purchase, during shipping, and at arrival.
            </p>
          </div>

          <div className={styles.testimonialsGrid}>
            {reviews.map((review) => (
              <article key={review.id} className={styles.testimonialCard}>
                <div
                  className={styles.rating}
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {/* The rating a buyer actually gave, not five stars every
                      time. A wall of identical five-star cards is the first
                      thing that makes a reviews section look invented. */}
                  <span aria-hidden="true">
                    {"\u2605".repeat(review.rating)}
                    <i>{"\u2605".repeat(5 - review.rating)}</i>
                  </span>
                  {review.verified && <small>Verified buyer</small>}
                </div>
                <blockquote>&ldquo;{review.review}&rdquo;</blockquote>
                <div className={styles.testimonialAuthor}>
                  <span>{initialsOf(review.name)}</span>
                  <div>
                    <strong>{review.name}</strong>
                    <small>
                      {[review.vehicle, review.country].filter(Boolean).join(" \u00b7 ")}
                    </small>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section
        id="contact"
        className={styles.contactSection}
        aria-labelledby="contact-title"
      >
        <div className={styles.contactDetails}>
          <p className={styles.kicker}>Start your export request</p>
          <h2 id="contact-title">
            Tell us what you are <em>looking for.</em>
          </h2>
          <p className={styles.contactLead}>
            Share your preferred make, model, budget, and destination. We will
            reply with suitable stock or a sourcing plan.
          </p>

          <div className={styles.contactList}>
            {contactInfo.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <span className={styles.contactIcon}>
                    <Icon aria-hidden="true" />
                  </span>
                  <span>
                    <small>{item.label}</small>
                    <strong>{item.value}</strong>
                  </span>
                </>
              );

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className={styles.contactItem}
                >
                  {content}
                </a>
              ) : (
                <div key={item.label} className={styles.contactItem}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        <HomeInquiryForm />
      </section>
    </main>
  );
}
