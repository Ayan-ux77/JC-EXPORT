import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Lato } from "next/font/google";
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

import { getModelsForMake, getVehiclePage, getVehicles } from "@/data/vehicle-service";
import { FeaturedVehicles } from "./components/featured-vehicles";
import { HomeInquiryForm } from "./components/home-inquiry-form";
import styles from "./page.module.css";

const bodyFont = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-body",
});

const displayFont = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

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

const testimonials = [
  {
    quote:
      "The inspection photos matched the vehicle that arrived. Documentation was ready before the vessel reached port, which made our clearance much easier.",
    name: "Joseph Mwangi",
    role: "Auto dealer, Nairobi",
    initials: "JM",
  },
  {
    quote:
      "I received a full walkaround before purchase and regular WhatsApp updates after booking. The process felt clear from the first quote to delivery.",
    name: "Fatima Al-Hashimi",
    role: "Private buyer, Dubai",
    initials: "FA",
  },
  {
    quote:
      "We imported multiple vans for our business. The team kept the vehicle list, shipping documents, and arrival schedule organized throughout.",
    name: "Daniel Chirwa",
    role: "Fleet buyer, Lilongwe",
    initials: "DC",
  },
];

const contactInfo = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+92 300 123 4567",
    href: "https://wa.me/923001234567",
  },
  {
    icon: Phone,
    label: "Direct phone",
    value: "+92 300 123 4567",
    href: "tel:+923001234567",
  },
  {
    icon: Mail,
    label: "Email",
    value: "sales@jcexport.com",
    href: "mailto:sales@jcexport.com",
  },
  {
    icon: MapPin,
    label: "Export support",
    value: "Japan-sourced vehicles, worldwide delivery",
  },
];

export default async function HomePage() {
  // The hero's quick search (make + model) and its stock count both read
  // straight off the same listing this fetches with limit 1 -- one round
  // trip for the total, not a full page of vehicles just to read its meta.
  // Models are unfiltered (getModelsForMake("")) because the hero form is
  // a plain GET <form>, not a client component: there is no make-selected
  // event to chain a model list off without JavaScript.
  const [vehicles, stock, models] = await Promise.all([
    getVehicles({ featuredOnly: true, limit: 6 }),
    getVehiclePage({ limit: 1 }),
    getModelsForMake(""),
  ]);
  const stockCount = stock.total;

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
              <label>
                <span>Make</span>
                <select name="make" defaultValue="">
                  <option value="">Any make</option>
                  {brands.map((brand) => (
                    <option key={brand.name} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Model</span>
                <select name="model" defaultValue="">
                  <option value="">Any model</option>
                  {models.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </label>
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
          <label>
            <span>Make</span>
            <select name="make" defaultValue="">
              <option value="">All makes</option>
              {brands.map((brand) => (
                <option key={brand.name} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Body type</span>
            <select name="body_type" defaultValue="">
              <option value="">All body types</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
            </select>
          </label>
          <label>
            <span>Year from</span>
            <select name="year_from" defaultValue="">
              <option value="">Any year</option>
              <option value="2021">2021</option>
              <option value="2019">2019</option>
              <option value="2017">2017</option>
              <option value="2015">2015</option>
            </select>
          </label>
          <label>
            <span>Max FOB price</span>
            <select name="price_max" defaultValue="">
              <option value="">No limit</option>
              <option value="5000">Up to $5,000</option>
              <option value="10000">Up to $10,000</option>
              <option value="20000">Up to $20,000</option>
              <option value="30000">Up to $30,000</option>
            </select>
          </label>
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
          <div className={styles.aboutImageCaption}>
            <span>Before you buy</span>
            <strong>See the actual vehicle, not a stock photo.</strong>
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

      <section
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
          {testimonials.map((testimonial, index) => (
            <article key={testimonial.name} className={styles.testimonialCard}>
              <div className={styles.rating} aria-label="5 out of 5 stars">
                <span aria-hidden="true">★★★★★</span>
                <small>Verified buyer</small>
              </div>
              <blockquote>&ldquo;{testimonial.quote}&rdquo;</blockquote>
              <div className={styles.testimonialAuthor}>
                <span className={index === 1 ? styles.avatarRed : ""}>
                  {testimonial.initials}
                </span>
                <div>
                  <strong>{testimonial.name}</strong>
                  <small>{testimonial.role}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

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
