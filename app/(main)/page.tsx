"use client";

import Link from "next/link";
import { useState } from "react";
import { vehicles } from "@/data/vehicles";
import styles from "./page.module.css";
import { Lateef } from "next/font/google";
import { Fraunces } from "next/font/google";
import { CiSearch } from "react-icons/ci";
import { PiCarLight } from "react-icons/pi";
import { PiCarProfileLight } from "react-icons/pi";
import { FiCheck } from "react-icons/fi";
import { FiShield, FiCheckCircle, FiClock, FiGlobe } from "react-icons/fi";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  HiOutlineDocumentText,
  HiOutlineDocumentDuplicate,
} from "react-icons/hi2";
import { title } from "process";
import { icons } from "lucide-react";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["300"],
});

const lateef = Lateef({
  subsets: ["latin"],
  weight: ["400"],
});

// CHANGED: stats ab array hai — pehle 4 identical blocks hardcoded the
const stats = [
  { id: 1, value: "15", suffix: "+", label: "Year Exporting" },
  { id: 2, value: "4200", suffix: "+", label: "Vehicles Shipped" },
  { id: 3, value: "32", suffix: "", label: "Countries Served" },
  {
    id: 4,
    value: "98",
    suffix: "%",
    label: "Client Retention",
    suffixColor: "red",
  },
];

// CHANGED: brand logos ab array hai — pehle 10 identical section blocks the
const brands = [
  { id: 1, name: "Honda", logo: "/home/honda-svgrepo-com 2.svg" },
  { id: 2, name: "Toyota", logo: "/home/toyota-svgrepo-com 2.svg" },
  { id: 3, name: "Mazda", logo: "/home/mazda-svgrepo-com 2.svg" },
  { id: 4, name: "nissan", logo: "/home/nissan.svg" },
  { id: 5, name: "Isuzu", logo: "/home/isuzu-2 2.svg" },
  { id: 6, name: "BMW", logo: "/home/bmw-logo-svgrepo-com 3.svg" },
  { id: 7, name: " Mitsubishi", logo: "/home/mitsubishi-svgrepo-com 2.svg" },
  { id: 8, name: "subaru", logo: "/home/subaru-alt-svgrepo-com 2.svg" },
  { id: 9, name: "Daihatsu", logo: "/home/Vector.svg", extraSpacing: true },
  { id: 10, name: "Suzuki", logo: "/home/Vector (1).svg", extraSpacing: true },
];

// CHANGED: search fields ab array hai — pehle 4 identical input blocks the
const searchFields = [
  { label: "Make", placeholder: "All Make" },
  { label: "BODY TYPE", placeholder: "All TYPE" },
  { label: "Year", placeholder: "All Make" },
  { label: "Max Price (USD)", placeholder: "All No Limit" },
];

const filters = [
  "All Stock",
  "Sedans",
  "SUVs",
  "Hybrids",
  "Kel Cars",
  "Trucks",
  "Luxury",
];

const processSteps = [
  {
    id: 1,
    step: "01 / 04",
    icon: <PiCarProfileLight />, // apna icon yahan lagayein
    title: "Car Export",
    description:
      "Sourced from Japan & UK auctions. Auction grade verification, FOB pricing, and full pre-purchase disclosure on every unit.",
    accentColor: "blue",
  },
  {
    id: 2,
    step: "01 / 04",
    icon: <CiSearch />,
    title: "Inspection",
    description:
      "JEVIC and JAAI certified inspections. Mechanical, structural, mileage, and chassis verification — independent reports for every vehicle.",
    accentColor: "red",
  },
  {
    id: 3,
    step: "01 / 04",
    icon: <HiOutlineDocumentText />,
    title: "Shipping",
    description:
      "RoRo and container shipping to 32 countries. Real-time tracking, port-to-port and door-to-door options, marine insurance included.",
    accentColor: "blue",
  },
  {
    id: 4,
    step: "01 / 04",
    icon: <HiOutlineDocumentDuplicate />,
    title: "Documentation",
    description:
      "L, invoice, export certificate, deregistration, and customs paperwork. Country-specific compliance for hassle-free clearance.",
    accentColor: "red",
  },
];

// CHANGED: checklist items array — data-driven, JSX mein hardcoded nahi
const aboutFeatures = [
  "Direct partnerships with USS, TAA, JU auctions",
  "Multilingual support (EN, UR, JP)",
  "Marine insurance on all shipments",
  "Multilingual support (EN, UR, JP)",
  "In-house clearing & forwarding",
  "Bonded yard inspection in Peshawar",
  "Aftersales parts sourcing service",
  "Bonded yard inspection in Peshawar",
];

// CHANGED: trust badges array — data-driven
const trustBadges = [
  {
    id: 1,
    icon: <FiShield />,
    title: "JEVIC Certified",
    subtitle: "Independent inspection",
    accentColor: "blue",
  },
  {
    id: 2,
    icon: <FiCheckCircle />,
    title: "FOB Guaranteed",
    subtitle: "Transparent pricing",
    accentColor: "red",
  },
  {
    id: 3,
    icon: <FiClock />,
    title: "15+ Years",
    subtitle: "Industry experience",
    accentColor: "blue",
  },
  {
    id: 4,
    icon: <FiGlobe />,
    title: "32 Countries",
    subtitle: "Global delivery network",
    accentColor: "red",
  },
];

// CHANGED: testimonials array — data-driven
const testimonials = [
  {
    id: 1,
    rating: 5,
    quote:
      "Third shipment from JC Export this year. Vehicles arrive exactly as inspected — no hidden damage, no auction-sheet surprises. They handle the documentation end-to-end and I just receive the BL.",
    name: "Joseph Mwangi",
    role: "Auto dealer · Nairobi, Kenya",
    initials: "JM",
    accentColor: "blue",
    highlighted: false,
  },
  {
    id: 2,
    rating: 5,
    quote:
      "Bought a Land Cruiser through JC last March. The pre-shipment video walkthrough was thorough, and they answered every question on WhatsApp within minutes. Felt like buying from a friend, not a stranger.",
    name: "Fatima Al-Hashimi",
    role: "Auto dealer · Nairobi, Kenya",
    initials: "FA",
    accentColor: "red",
    highlighted: true,
  },
  {
    id: 3,
    rating: 5,
    quote:
      "Imported a fleet of 12 Hiace vans for our logistics business. Pricing was fair, paperwork landed before the ship did, and customs cleared in three days. We're working with them on the next batch.",
    name: "Daniel Chirwa",
    role: "Auto dealer · Nairobi, Kenya",
    initials: "DC",
    accentColor: "blue",
    highlighted: false,
  },
];

// CHANGED: contact info array — data-driven
const contactInfo = [
  {
    id: 1,
    icon: <FaWhatsapp />,
    label: "Whatsapp. Fastest Reply",
    value: "+92 30012357987",
    bgColor: "#25A249",
  },
  {
    id: 2,
    icon: <FaPhoneAlt />,
    label: "Direct Phone",
    value: "+92 2197357984",
    bgColor: "#C30010",
  },
  {
    id: 3,
    icon: <FaEnvelope />,
    label: "Email",
    value: "sales@jcexpert.com",
    bgColor: "#287EC9",
  },
  {
    id: 4,
    icon: <FaMapMarkerAlt />,
    label: "Office Address",
    value: "Site Area, Peshawar, Pakistan",
    bgColor: "#1B4F8C",
  },
];

const whatsApp = [{}];

// CHANGED: form fields array — 2 columns, data-driven
const formFields = [
  {
    id: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Your Name",
  },
  {
    id: "country",
    label: "Country",
    type: "text",
    placeholder: "Destination Country",
  },
  { id: "email", label: "Email", type: "email", placeholder: "you@gmail.com" },
  {
    id: "phone",
    label: "Phone / Whatsapp",
    type: "text",
    placeholder: "+ xx xxx xxxxxx",
  },
];

const vehicleOptions = ["Sedan", "SUV", "Hybrid", "Truck", "Luxury", "Kei Car"];

export default function Page() {
  const [activeFilter, setActiveFilter] = useState("All Stock");

  return (
    <main className={styles.page}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <section className={styles.heroBadge}>
          <span className={styles.badgeLine}></span>
          <span className={lateef.className}>PREMIUM AUTO EXPORT · JAPAN</span>
        </section>

        <section className={styles.heroContent}>
          <h1>Japanese Excellence,</h1>
          <span className={styles.heroDivider1}></span>
          <h2 className={fraunces.className}>Delivered </h2>
          <h2 className={fraunces.className}>
            Worldwide <span>.</span>
          </h2>

          <p className={styles.heroDescription}>
            Welcome to Japan Car Export - One of Japan’s fastest growing
            Japanese used cars exporter. JC Export sources, inspects, and ships
            premium Japanese vehicles with documentation handled door-to-door.
            Fifteen years of trust, zero shortcuts.
          </p>

          <section className={styles.heroActions}>
            <button type="button" className={styles.primaryBtn}>
              Explore Inventory &rarr;
            </button>
            <button type="button" className={styles.secondaryBtn}>
              Talk to an Expert
            </button>
          </section>
        </section>
      </section>

      {/*  STATS */}
      <section className={styles.statsBar}>
        {stats.map((stat) => (
          <section key={stat.id} className={styles.statItem}>
            <h1>
              {stat.value}{" "}
              {stat.suffix && (
                <span
                  style={
                    stat.suffixColor ? { color: stat.suffixColor } : undefined
                  }
                >
                  {stat.suffix}
                </span>
              )}
            </h1>
            <p className={styles.statLabel}>{stat.label}</p>
          </section>
        ))}
      </section>

      {/* ================= SEARCH ================= */}
      <section className={styles.searchSection}>
        <section className={styles.sectionBadge}>
          <span className={styles.badgeLineBlue}></span>
          <span
            className={styles.font}
            style={{ color: "rgba(40, 126, 201, 1)" }}
          >
            FIND YOUR VEHICLE
          </span>
        </section>

        <section className={styles.searchFields}>
          {searchFields.map((field) => (
            <section key={field.label}>
              <p>{field.label}</p>
              <input type="number" placeholder={field.placeholder} />
            </section>
          ))}
        </section>

        <section className={styles.searchButtonRow}>
          <button type="button" className={styles.searchButton}>
            <CiSearch />
            Search
          </button>
        </section>

        <section className={styles.brandsGrid}>
          {brands.map((brand) => (
            <section
              key={brand.id}
              className={`${styles.brandItem} ${
                brand.extraSpacing ? styles.brandItemSpaced : ""
              }`}
            >
              <img src={brand.logo} alt={brand.name.trim()} />
              <p>{brand.name}</p>
            </section>
          ))}
        </section>

        {/* ================= INVENTORY ================= */}
        <section className={styles.inventorySection}>
          <section className={styles.inventoryInner}>
            <section className={styles.sectionBadge}>
              <span className={styles.badgeLineBlue}></span>
              <span
                className={lateef.className}
                style={{ color: "rgba(40, 126, 201, 1)" }}
              >
                FEATURE INVENTORY
              </span>
            </section>

            <h1 className={fraunces.className} style={{ color: "black" }}>
              Hand-picked vehicles,
              <br />{" "}
              <span style={{ color: "rgba(40, 126, 201, 1)" }}>
                auction-fresh.
              </span>
            </h1>

            <section className={styles.inventoryLinkRow}>
              <Link href="/inventory">View all 246 Vehicles &rarr;</Link>
            </section>

            <section className={styles.filterBar}>
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`${styles.filterBtn} ${
                    activeFilter === filter ? styles.filterBtnActive : ""
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </section>

            <section className={styles.vehicleGrid}>
              {vehicles.slice(0, 6).map((vehicle) => (
                <section key={vehicle.id} className={styles.vehicleCard}>
                  <img src={vehicle.image} alt={vehicle.title} />

                  <section className={styles.vehicleCardBody}>
                    <section className={styles.vehicleCardHeader}>
                      <span className={styles.vehicleBrand}>
                        {vehicle.brand}
                      </span>
                      <span>{vehicle.year}</span>
                    </section>

                    <section className={styles.vehicleTitleRow}>
                      <h3>{vehicle.title}</h3>
                      <span className={styles.vehicleDivider}></span>
                    </section>

                    <section className={styles.vehicleSpecs}>
                      <section>
                        <h5>{vehicle.mileage}</h5>
                        <p>MILEAGE</p>
                      </section>
                      <section>
                        <h5>{vehicle.engine}</h5>
                        <p>ENGINE</p>
                      </section>
                      <section>
                        <h5>{vehicle.fuel}</h5>
                        <p>FUEL</p>
                      </section>
                    </section>

                    <span className={styles.vehicleDivider}></span>

                    <section className={styles.vehiclePriceRow}>
                      <section>
                        <p className={styles.vehiclePriceLabel}>FOB Price</p>

                        <h1 className={styles.vehiclePriceValue}>
                          $ {vehicle.price}
                        </h1>
                      </section>

                      <Link
                        href={{
                          pathname: `/inventory/${vehicle.slug}`,
                          query: JSON.stringify(vehicle),
                        }}
                        className={styles.vehicleViewDetail}
                      >
                        View Detail &rarr;
                      </Link>
                    </section>
                  </section>
                </section>
              ))}
            </section>
          </section>

          <section className={styles.services}>
            <section className={styles.services1}>
              <span className={styles.badgeLineBlue}></span>
              <span
                className={lateef.className}
                style={{ color: "rgba(40, 126, 201, 1)" }}
              >
                Our Services
              </span>
            </section>

            <section className={styles.export}>
              <h1 className={fraunces.className} style={{ color: "black" }}>
                End-to-end exports, 
                <br />{" "}
                <span style={{ color: "rgba(40, 126, 201, 1)" }}>
                    handled.
                </span>
              </h1>

              <section className={styles.processGrid}>
                {processSteps.map((step) => (
                  <section
                    key={step.id}
                    className={`${styles.processCard} ${
                      step.accentColor === "red" ? styles.processCardRed : ""
                    }`}
                  >
                    <span
                      className={`${fraunces.className} ${styles.processStep}`}
                    >
                      {step.step}
                    </span>

                    <span className={styles.processIcon}>{step.icon}</span>

                    <h3 className={styles.processTitle}>{step.title}</h3>
                    <p className={styles.processDescription}>
                      {step.description}
                    </p>
                  </section>
                ))}
              </section>
            </section>

            <section className={styles.aboutSection}>
              <section className={styles.aboutImageWrapper}>
                <img
                  src="/Building.png"
                  alt="JC Export headquarters building"
                  className={styles.aboutImage}
                />
              </section>

              <section className={styles.aboutContent}>
                <section className={styles.sectionBadge}>
                  <span className={styles.badgeLineBlue}></span>
                  <span
                    className={lateef.className}
                    style={{ color: "rgba(40, 126, 201, 1)" }}
                  >
                    ABOUT JC EXPORT
                  </span>
                </section>

                <h2 className={styles.aboutHeading}>
                  Built on trust,{" "}
                  <span
                    className={fraunces.className}
                    style={{ color: "rgba(40, 126, 201, 1)" }}
                  >
                    shipped with precision
                  </span>
                  .
                </h2>

                <p className={styles.aboutIntro}>
                  JC Export started in 2008 with a single shipment to Mombasa.
                  Today we move fleets of Japanese vehicles to 32 countries —
                  but we still pick up every call ourselves.
                </p>

                <p className={styles.aboutDescription}>
                  We work with verified suppliers across Japan, UK, and Korea.
                  Every vehicle is auction-graded, independently inspected, and
                  photographed before purchase. No surprises at the port.
                </p>

                <ul className={styles.aboutFeatureGrid}>
                  {aboutFeatures.map((feature, index) => (
                    <li key={index} className={styles.aboutFeatureItem}>
                      <FiCheck className={styles.aboutFeatureIcon} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button type="button" className={styles.aboutCta}>
                  Schedule a call &rarr;
                </button>
              </section>
            </section>
            <section className={styles.trustBar}>
              {trustBadges.map((badge) => (
                <section key={badge.id} className={styles.trustItem}>
                  <span
                    className={`${styles.trustIcon} ${
                      badge.accentColor === "red" ? styles.trustIconRed : ""
                    }`}
                  >
                    {badge.icon}
                  </span>

                  <h4 className={styles.trustTitle}>{badge.title}</h4>
                  <p className={styles.trustSubtitle}>{badge.subtitle}</p>
                </section>
              ))}
              {/* <span className={styles.sectionDivider}></span> */}
            </section>
            <span className={styles.sectionDivider}></span>
          </section>

          <section className={styles.testimonialsSection}>
            <section className={styles.sectionBadge}>
              <span className={styles.badgeLineBlue11}></span>
              <span className={lateef.className} style={{ color: "white" }}>
                CLIENT STORIES
              </span>
            </section>

            <h2 className={styles.testimonialsHeading}>
              What our buyers{" "}
              <span
                className={fraunces.className}
                style={{ color: "rgba(40, 126, 201, 1)" }}
              >
                actually, <br />
                say
              </span>
              .
            </h2>

            <section className={styles.testimonialsGrid}>
              {testimonials.map((testimonial) => (
                <section
                  key={testimonial.id}
                  className={`${styles.testimonialCard} ${
                    testimonial.highlighted
                      ? styles.testimonialCardHighlighted
                      : ""
                  }`}
                >
                  <section className={styles.testimonialTopRow}>
                    <span className={styles.testimonialStars}>
                      {"★".repeat(testimonial.rating)}
                    </span>
                    <span className={styles.testimonialQuoteMark}>!!</span>
                  </section>

                  <p className={styles.testimonialQuote}>{testimonial.quote}</p>

                  <section className={styles.testimonialAuthorRow}>
                    <span
                      className={`${styles.testimonialAvatar} ${
                        testimonial.accentColor === "red"
                          ? styles.testimonialAvatarRed
                          : ""
                      }`}
                    >
                      {testimonial.initials}
                    </span>

                    <section>
                      <p className={styles.testimonialName}>
                        {testimonial.name}
                      </p>
                      <p className={styles.testimonialRole}>
                        {testimonial.role}
                      </p>
                    </section>
                  </section>
                </section>
              ))}
            </section>
          </section>
        </section>
      </section>
      <section className={styles.contactForm}>
        <section className={styles.sectionBadge}>
          <span className={styles.badgeLineBlue12}></span>
          <span className={lateef.className} style={{ color: "red" }}>
            CLIENT STORIES
          </span>
        </section>

        <h2 className={styles.contact}>
          Tell us what youre 
          <br />{" "}
          <span
            className={fraunces.className}
            style={{ color: "rgba(40, 126, 201, 1)" }}
          >
            looking for.
          </span>
        </h2>

        <section className={styles.contactList}>
          {contactInfo.map((item) => {
            console.log("item", item);
            return (
              <section key={item.id} className={styles.contactCard}>
                <span
                  className={styles.contactIcon}
                  style={{ backgroundColor: item.bgColor }}
                >
                  {item.icon}
                </span>

                <section>
                  <p className={styles.contactLabel}>{item.label}</p>
                  <p className={styles.contactLabel}>{item.value}</p>
                </section>
              </section>
            );
          })}
        </section>
      </section>
      <section className={styles.quoteForm}>
        <h2 className={styles.quoteTitle}>Request a quote</h2>

        <section className={styles.formGrid}>
          <section className={styles.formGroup}>
            <label>Full Name</label>
            <input type="text" placeholder="Your Name" />
          </section>

          <section className={styles.formGroup}>
            <label>Country</label>
            <input type="text" placeholder="Destination Country" />
          </section>

          <section className={styles.formGroup}>
            <label>Email</label>
            <input type="email" placeholder="you@gmail.com" />
          </section>

          <section className={styles.formGroup}>
            <label>Phone / Whatsapp</label>
            <input type="text" placeholder="+ xx xxx xxxxxx" />
          </section>
        </section>

        <section className={styles.formGroup}>
          <label>Vehicle Interest</label>

          <select>
            <option>Sedan</option>
            <option>SUV</option>
            <option>Hybrid</option>
            <option>Truck</option>
            <option>Luxury</option>
          </select>
        </section>

        <section className={styles.formGroup}>
          <label>Message</label>

          <textarea
            rows={5}
            placeholder="Tell us your budget, preferred make/model, year range..."
          ></textarea>
        </section>

        <button className={styles.submitBtn}>SEND INQUIRY →</button>
      </section>
    </main>
  );
}
