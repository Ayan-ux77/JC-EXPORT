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
  Fuel,
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

import { vehicles } from "@/data/vehicles";
import { FeaturedInventory } from "./components/featured-inventory";
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
  title: "Japanese Used Cars for Export | JC Export",
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

export default function HomePage() {
  return (
    <main className={`${styles.page} ${bodyFont.variable} ${displayFont.variable}`}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <Image
          src="/home-hero.webp"
          alt="Used Japanese vehicles prepared for export at a port inspection yard"
          fill
          preload
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

            <div className={styles.heroActions}>
              <Link href="/inventory" className={styles.primaryButton}>
                Browse inventory <ArrowRight aria-hidden="true" />
              </Link>
              <Link href="#contact" className={styles.secondaryButton}>
                Get an export quote
              </Link>
            </div>
          </div>

          <aside className={styles.heroNote} aria-label="Export process summary">
            <span className={styles.heroNoteLabel}>From Japan to your port</span>
            <strong>One team. One clear shipment.</strong>
            <div className={styles.heroNoteRoute}>
              <span>Source</span>
              <span>Inspect</span>
              <span>Ship</span>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.searchPanel} aria-labelledby="vehicle-search-title">
        <div className={styles.searchHeading}>
          <div>
            <p className={styles.kicker}>Search current stock</p>
            <h2 id="vehicle-search-title">Find the right used vehicle</h2>
          </div>
          <Link href="/inventory" className={styles.textLink}>
            Advanced search <SlidersHorizontal aria-hidden="true" />
          </Link>
        </div>

        <form className={styles.searchForm} action="/inventory">
          <label>
            <span>Make</span>
            <select name="make" defaultValue="">
              <option value="">All makes</option>
              {brands.map((brand) => (
                <option key={brand.name} value={brand.name.toLowerCase()}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Body type</span>
            <select name="bodyType" defaultValue="">
              <option value="">All body types</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="hatchback">Hatchback</option>
              <option value="van">Van</option>
              <option value="truck">Truck</option>
            </select>
          </label>
          <label>
            <span>Year from</span>
            <select name="year" defaultValue="">
              <option value="">Any year</option>
              <option value="2021">2021</option>
              <option value="2019">2019</option>
              <option value="2017">2017</option>
              <option value="2015">2015</option>
            </select>
          </label>
          <label>
            <span>Max FOB price</span>
            <select name="maxPrice" defaultValue="">
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

      <section className={styles.statsSection} aria-label="JC Export in numbers">
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
              href={`/inventory?brand=${brand.name.toLowerCase()}`}
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
        id="inventory"
        className={styles.inventorySection}
        aria-labelledby="inventory-title"
      >
        <div className={styles.sectionIntroRow}>
          <div>
            <p className={styles.kicker}>Featured inventory</p>
            <h2 id="inventory-title">
              Hand-picked vehicles, <em>auction fresh.</em>
            </h2>
          </div>
          <Link href="/inventory" className={styles.textLink}>
            View all vehicles <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <FeaturedInventory vehicles={vehicles.slice(0, 6)} />
      </section>

      <section id="services" className={styles.processSection} aria-labelledby="process-title">
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

      <section id="about" className={styles.aboutSection} aria-labelledby="about-title">
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
          <p className={styles.kicker}>Why buyers choose JC Export</p>
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

          <Link href="#contact" className={styles.inlineButton}>
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

      <section className={styles.testimonialsSection} aria-labelledby="stories-title">
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

      <section id="contact" className={styles.contactSection} aria-labelledby="contact-title">
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
                <a key={item.label} href={item.href} className={styles.contactItem}>
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

        <form className={styles.quoteForm}>
          <div className={styles.quoteFormHeader}>
            <span>Export inquiry</span>
            <Fuel aria-hidden="true" />
          </div>
          <div className={styles.formGrid}>
            <label>
              <span>Full name</span>
              <input name="name" type="text" placeholder="Your name" autoComplete="name" />
            </label>
            <label>
              <span>Destination country</span>
              <input name="country" type="text" placeholder="e.g. Kenya" autoComplete="country-name" />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" placeholder="you@example.com" autoComplete="email" />
            </label>
            <label>
              <span>Phone / WhatsApp</span>
              <input name="phone" type="tel" placeholder="+00 000 000 000" autoComplete="tel" />
            </label>
          </div>
          <label>
            <span>Vehicle interest</span>
            <select name="vehicle" defaultValue="">
              <option value="">Select a body type</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="hatchback">Hatchback</option>
              <option value="van">Van</option>
              <option value="truck">Truck</option>
            </select>
          </label>
          <label>
            <span>What should we source?</span>
            <textarea
              name="message"
              rows={5}
              placeholder="Make, model, year range, budget, and any must-have features"
            />
          </label>
          <button type="submit" className={styles.submitButton}>
            Send inquiry <ArrowRight aria-hidden="true" />
          </button>
          <p className={styles.formNote}>
            We only use your details to respond to this request.
          </p>
        </form>
      </section>
    </main>
  );
}
