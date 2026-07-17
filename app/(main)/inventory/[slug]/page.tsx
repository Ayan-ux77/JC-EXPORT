// "use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { vehicles } from "@/data/vehicles";
import styles from "./page.module.css";
import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["500"],
});

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function VehicleDetailsPage({ params }: PageProps) {
  const paramcheck = await params;

  console.log("paramscheck", paramcheck);

  const { slug } = await params;

  console.log("slug", slug);

  const vehicle = vehicles.find((item) => item.slug === slug);

  console.log("vehicle", vehicle);

  if (!vehicle) {
    notFound();
  }

  const vehiclePrice = Number(vehicle.price.replaceAll(",", ""));
  const freightPrice = Number(vehicle.freight.replaceAll(",", ""));
  const insurancePrice = Number(vehicle.insurance.replaceAll(",", ""));

  const totalPrice = vehiclePrice + freightPrice + insurancePrice;

  return (
    <main className={styles.detailsPage}>
      <section className={styles.container}>
        <section className={styles.breadcrumb}></section>
        <section className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/">Inventory</Link>
          <span>/</span>
          <span>{vehicle.brand}</span>
          <span>/</span>
          <strong>
            {vehicle.title} {vehicle.year}
          </strong>
        </section>

        <section className={styles.productLayout}>
          <section className={styles.leftColumn}>
            <section className={styles.mainImageWrapper}>
              <img
                src={vehicle.images[0]}
                alt={vehicle.title}
                className={styles.mainImage}
              />
            </section>

            <section className={styles.thumbnailRow}>
              {vehicle.images.map((image, index) => (
                <section
                  key={`${vehicle.id}-${index}`}
                  className={styles.thumbnail}
                >
                  <img src={image} alt={`${vehicle.title} ${index + 1}`} />
                </section>
              ))}
            </section>

            <section className={styles.specificationSection}>
              <section className={styles.specification}>
                <span className={styles.badgeLine}></span>
                <p style={{ color: "#287ec9" }}>Specification</p>
              </section>
              <h2>
                Full{" "}
                <span
                  className={fraunces.className}
                  style={{ color: "#287ec9" }}
                >
                  Spec Sheet
                </span>
              </h2>

              <section className={styles.specGrid}>
                <section>
                  <p>YEAR</p>
                  <strong>{vehicle.year}</strong>
                </section>

                <section>
                  <p>MILEAGE</p>
                  <strong>{vehicle.mileage}</strong>
                </section>

                <section>
                  <p>ENGINE</p>
                  <strong>{vehicle.engine}</strong>
                </section>

                <section>
                  <p>TRANSMISSION</p>
                  <strong>{vehicle.transmission}</strong>
                </section>

                <section>
                  <p>DRIVETRAIN</p>
                  <strong>{vehicle.drivetrain}</strong>
                </section>

                <section>
                  <p>FUEL</p>
                  <strong>{vehicle.fuel}</strong>
                </section>

                <section>
                  <p>COLOR</p>
                  <strong>{vehicle.color}</strong>
                </section>

                <section>
                  <p>INTERIOR</p>
                  <strong>{vehicle.interior}</strong>
                </section>

                <section>
                  <p>STEERING</p>
                  <strong>{vehicle.steering}</strong>
                </section>
              </section>
            </section>

            <section className={styles.inspectionSection}>
              <h2>
                Inspection{" "}
                <span
                  className={fraunces.className}
                  style={{ color: "#287ec9" }}
                >
                  Report
                </span>
              </h2>

              <section className={styles.inspectionCard}>
                <section>
                  <p>AUCTION GRADE</p>
                  <h3>{vehicle.auctionGrade}</h3>
                </section>

                <span className={styles.verified}>Verified by JC</span>

                <p className={styles.description}>{vehicle.description}</p>
              </section>
            </section>
          </section>

          <section className={styles.rightColumn}>
            <span className={styles.featured}>FEATURED</span>

            <h1 className={styles.carBrands}>
              {vehicle.year} {vehicle.brand}{" "}
              <span className={fraunces.className} style={{ color: "#287ec9" }}>
                {vehicle.title.replace(vehicle.brand.toUpperCase(), "")}
              </span>
            </h1>

            <section className={styles.stockRow}>
              <strong>Stock #{vehicle.stock}</strong>
              <strong>{vehicle.location}</strong>
            </section>

            <section className={styles.priceCard}>
              <p>FOB {vehicle.location.toUpperCase()}</p>
              <h2>${vehicle.price}</h2>
              <strong>+ Freight & destination charges (quote provided)</strong>
            </section>

            <section className={styles.actionRow}>
              <button type="button" className={styles.reserveButton}>
                Reserve Now
              </button>

              <button type="button" className={styles.inspectionButton}>
                Request Inspection
              </button>
            </section>

            <section className={styles.salesCard}>
              <section className={styles.salesTop}>
                <span className={styles.avatar}>YI</span>

                <section className={styles.name}>
                  <h3>Yousaf Iqbal</h3>
                  <p>Senior Sales</p>
                </section>
              </section>

              <section className={styles.salesButtons}>
                <a href="tel:+923001234567">Call</a>

                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </section>
            </section>

            <section className={styles.totalCard}>
              <h3>Estimated Total to Peshawar</h3>

              <section className={styles.totalRow}>
                <span>Vehicle (FOB)</span>
                <strong>${vehicle.price}</strong>
              </section>

              <section className={styles.totalRow}>
                <span>Ocean Freight</span>
                <strong>${vehicle.freight}</strong>
              </section>

              <section className={styles.totalRow}>
                <span>Insurance</span>
                <strong>${vehicle.insurance}</strong>
              </section>

              <span className={styles.divider11}></span>

              <section className={styles.totalRow}>
                <strong>Total CIF</strong>
                <strong className={styles.totalPrice}>
                  ${totalPrice.toLocaleString()}
                </strong>
              </section>
            </section>
          </section>
        </section>
      </section>
    </main>
  );
}
