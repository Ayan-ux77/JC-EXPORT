"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { Fraunces } from "next/font/google";
import { vehicles } from "@/data/vehicles";
import { Pagination } from "../components/pagination";
import { useEffect, useState } from "react";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["500"],
});

const auctionGrades = [
  { id: 1, name: "Grade 5 (Excellent)", checked: true },
  { id: 2, name: "Grade 4.5", checked: true },
  { id: 3, name: "Grade 4", checked: false },
  { id: 4, name: "Grade 3.5 & below", checked: false },
];

export default function Listing() {
  const itemsPerPage = 9;
  const [makes, setMakes] = useState<
    { id: number; name: string; count: number }[]
  >([]);

  const [bodyTypes, setBodyTypes] = useState<
    { id: number; name: string; count: number }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentVehicles = vehicles.slice(startIndex, endIndex);

  const pageCount = Math.ceil(vehicles.length / itemsPerPage);

  const handlePageChange = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  useEffect(() => {
    const makesCount = vehicles.reduce<Record<string, number>>(
      (acc, vehicle) => {
        const brand = vehicle.brand;
        acc[brand] = (acc[brand] || 0) + 1;

        return acc;
      },
      {},
    );

    // console.log("vehicleArray", vehiclesArray);

    const vehicleMakes = Object.entries(makesCount).map(
      ([brand, count], index) => ({
        id: index + 1,
        name: brand,
        count: count,
      }),
    );

    setMakes(vehicleMakes);
  }, []);

  useEffect(() => {
    const bodyTypeCount = vehicles.reduce<Record<string, number>>(
      (acc, vehicle) => {
        const bodyType = vehicle.bodyType;

        acc[bodyType] = (acc[bodyType] || 0) + 1;

        return acc;
      },
      {},
    );

    console.log("Body Type Count Object:", bodyTypeCount);

    const vehicleBodyTypes = Object.entries(bodyTypeCount).map(
      ([bodyType, count], index) => ({
        id: index + 1,
        name: bodyType,
        count: count,
      }),
    );

    console.log("Final Body Types Array:", vehicleBodyTypes);
    console.table(vehicleBodyTypes);

    setBodyTypes(vehicleBodyTypes);
  }, []);
  return (
    <section className={styles.body1}>
      <section className={styles.heroSection}>
        <section>
          <span>Home </span> /<span>Inventory</span>
          <h1 className={styles.browse}>
            Browse{" "}
            <span
              className={fraunces.className}
              style={{ color: "rgba(36, 105, 166, 1" }}
            >
              Inventory.
            </span>
          </h1>
          <p className={styles.paragraph}>
            412 vehicles available · Updated daily from Tokyo, Yokohama, and
            Nagoya auctions
          </p>
        </section>
      </section>

      <section className={styles.searchBar}>
        <p>
          Showing {vehicles.length === 0 ? 0 : startIndex + 1}–
          {Math.min(endIndex, vehicles.length)} of {vehicles.length} results
        </p>

        <section className={styles.bar}>
          <select className={styles.sortSelect}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <button type="button" className={styles.btn}>
            Compare
          </button>
        </section>
      </section>

      <section>
        <section className={styles.sideBar}>
          <p>Search</p>

          <input type="text" placeholder="Make,Model...." />
          <span className={styles.divider12}></span>

          <section className={styles.filterSection}>
            <p className={styles.filterTitle}>Make</p>

            {makes.map((make) => (
              <section key={make.id} className={styles.filterRow}>
                <section className={styles.filterLeft}>
                  <input type="checkbox" id={`make-${make.id}`} />

                  <label htmlFor={`make-${make.id}`}>{make.name}</label>
                </section>

                <span className={styles.filterCount}>{make.count}</span>
              </section>
            ))}
          </section>
          <span className={styles.divider12}></span>
          <section className={styles.filterSection}>
            <p className={styles.filterTitle}>Body Type</p>

            {bodyTypes.map((bodyType) => (
              <section key={bodyType.id} className={styles.filterRow}>
                <section className={styles.filterLeft}>
                  <input type="checkbox" id={`body-type-${bodyType.id}`} />

                  <label htmlFor={`body-type-${bodyType.id}`}>
                    {bodyType.name}
                  </label>
                </section>

                <span className={styles.filterCount}>{bodyType.count}</span>
              </section>
            ))}
          </section>
          <span className={styles.divider12}></span>

          <section className={styles.filterSection}>
            <p className={styles.filterTitle}>Prices Range(USD)</p>

            <section className={styles.counterInput}>
              <input type="text" placeholder="Min" />
              <input type="text" placeholder="Max" />
            </section>

            <span className={styles.divider12}></span>
          </section>

          <section className={styles.filterSection}>
            <p className={styles.filterTitle}>Year</p>

            <section className={styles.counterInput}>
              <input type="text" placeholder="2018" />
              <input type="text" placeholder="2026" />
            </section>

            <span className={styles.divider12}></span>

            <section className={styles.filterSection}>
              <p className={styles.filterTitle}>AuctionsGrades</p>

              {auctionGrades.map((type) => (
                <section key={type.id} className={styles.filterRow}>
                  <section className={styles.filterLeft}>
                    <input
                      type="checkbox"
                      name=""
                      id={`auctionGrades-${type.id}`}
                    />

                    <label htmlFor={`auctionGrades-${type.id}`}>
                      {type.name}
                    </label>
                  </section>
                </section>
              ))}
            </section>
          </section>
        </section>
      </section>

      <section className={styles.vehicleGrid}>
        {currentVehicles.map((vehicle) => (
          <section key={vehicle.id} className={styles.vehicleCard}>
            <img
              src={vehicle.image}
              alt={vehicle.title}
              className={styles.vehicleImage}
            />

            <section className={styles.vehicleCardBody}>
              <section className={styles.vehicleCardHeader}>
                <span className={styles.vehicleBrand}>{vehicle.brand}</span>
                <span>{vehicle.year}</span>
              </section>

              <h3 className={styles.vehicleTitle}>{vehicle.title}</h3>

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

              <section className={styles.vehiclePriceRow}>
                <section>
                  <p className={styles.vehiclePriceLabel}>FOB Price</p>

                  <h2 className={styles.vehiclePrice}>${vehicle.price}</h2>
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
        <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
      </section>
    </section>
  );
}
