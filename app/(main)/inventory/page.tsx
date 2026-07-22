"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { Fraunces } from "next/font/google";
import { vehicles as originalVehicles } from "@/data/vehicles";
import { Pagination } from "../components/pagination";
import { useEffect, useMemo, useState } from "react";

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

  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);

  console.log("selected makes", selectedMakes);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const makes = useMemo(() => {
    const makesCount = originalVehicles.reduce<Record<string, number>>(
      (accumulator, vehicle) => {
        const brand = vehicle.brand;

        accumulator[brand] = (accumulator[brand] || 0) + 1;

        return accumulator;
      },
      {},
    );

    return Object.entries(makesCount).map(([brand, count], index) => ({
      id: index + 1,
      name: brand,
      count,
    }));
  }, []);

  console.log("makes", makes);

  const bodyTypes = useMemo(() => {
    const bodyTypeCount = originalVehicles.reduce<Record<string, number>>(
      (accumulator, vehicle) => {
        const bodyType = vehicle.bodyType;

        accumulator[bodyType] = (accumulator[bodyType] || 0) + 1;

        return accumulator;
      },
      {},
    );

    return Object.entries(bodyTypeCount).map(([bodyType, count], index) => ({
      id: index + 1,
      name: bodyType,
      count,
    }));
  }, []);

  function toggleCheckboxValue(
    value: string,
    checked: boolean,
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    setSelectedValues((previousValues) => {
      console.log("previous values", previousValues);
      if (checked) {
        if (previousValues.includes(value)) {
          return previousValues;
        }

        return [...previousValues, value];
      }

      return previousValues.filter((previousValue) => previousValue !== value);
    });
  }

  function handleMakeChange(make: string, checked: boolean) {
    toggleCheckboxValue(make, checked, setSelectedMakes);
  }

  function handleBodyTypeChange(bodyType: string, checked: boolean) {
    toggleCheckboxValue(bodyType, checked, setSelectedBodyTypes);
  }

  const filteredVehicles = useMemo(() => {
    return originalVehicles.filter((vehicle) => {
      const matchesMake =
        selectedMakes.length === 0 ||
        selectedMakes.some(
          (selectedMake) =>
            selectedMake.toLowerCase() === vehicle.brand.toLowerCase(),
        );

      /*
       * Body type match
       */
      const matchesBodyType =
        selectedBodyTypes.length === 0 ||
        selectedBodyTypes.some(
          (selectedBodyType) =>
            selectedBodyType.toLowerCase() === vehicle.bodyType.toLowerCase(),
        );

      return matchesMake && matchesBodyType && matchesSearch;
    });
  }, [selectedMakes, selectedBodyTypes, searchTerm]);

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedMakes, selectedBodyTypes, searchTerm]);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  const pageCount = Math.ceil(filteredVehicles.length / itemsPerPage);

  function handlePageChange(event: { selected: number }) {
    setCurrentPage(event.selected);
  }

  return (
    <section className={styles.body1}>
      {/* Hero section */}

      <section className={styles.heroSection}>
        <section>
          <span>Home </span> / <span>Inventory</span>
          <h1 className={styles.browse}>
            Browse{" "}
            <span
              className={fraunces.className}
              style={{ color: "rgba(36, 105, 166, 1)" }}
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

      {/* Result and sorting section */}

      <section className={styles.searchBar}>
        <p>
          Showing {filteredVehicles.length === 0 ? 0 : startIndex + 1}–
          {Math.min(endIndex, filteredVehicles.length)} of{" "}
          {filteredVehicles.length} results
        </p>

        <section className={styles.bar}>
          <select className={styles.sortSelect}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <button type="button" className={styles.btn}></button>
        </section>
      </section>

      {/* Sidebar */}

      <section>
        <section className={styles.sideBar}>
          <p>Search</p>

          <input
            type="text"
            placeholder="Make, Model...."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <span className={styles.divider12}></span>

          {/* Make filter */}

          <section className={styles.filterSection}>
            <p className={styles.filterTitle}>Make</p>

            {makes.map((make) => (
              <section key={make.id} className={styles.filterRow}>
                <section className={styles.filterLeft}>
                  <input
                    type="checkbox"
                    id={`make-${make.id}`}
                    checked={selectedMakes.includes(make.name)}
                    onChange={(event) =>
                      handleMakeChange(make.name, event.target.checked)
                    }
                  />

                  <label htmlFor={`make-${make.id}`}>{make.name}</label>
                </section>

                <span className={styles.filterCount}>{make.count}</span>
              </section>
            ))}
          </section>

          <span className={styles.divider12}></span>

          {/* Body type filter */}

          <section className={styles.filterSection}>
            <p className={styles.filterTitle}>Body Type</p>

            {bodyTypes.map((bodyType) => (
              <section key={bodyType.id} className={styles.filterRow}>
                <section className={styles.filterLeft}>
                  <input
                    type="checkbox"
                    id={`body-type-${bodyType.id}`}
                    checked={selectedBodyTypes.includes(bodyType.name)}
                    onChange={(event) =>
                      handleBodyTypeChange(bodyType.name, event.target.checked)
                    }
                  />

                  <label htmlFor={`body-type-${bodyType.id}`}>
                    {bodyType.name}
                  </label>
                </section>

                <span className={styles.filterCount}>{bodyType.count}</span>
              </section>
            ))}
          </section>

          <span className={styles.divider12}></span>

          {/* Price filter design */}

          <section className={styles.filterSection}>
            <p className={styles.filterTitle}>Price Range (USD)</p>

            <section className={styles.counterInput}>
              <input type="text" placeholder="Min" />
              <input type="text" placeholder="Max" />
            </section>
          </section>

          <span className={styles.divider12}></span>

          {/* Year filter design */}

          <section className={styles.filterSection}>
            <p className={styles.filterTitle}>Year</p>

            <section className={styles.counterInput}>
              <input type="text" placeholder="2018" />
              <input type="text" placeholder="2026" />
            </section>
          </section>

          <span className={styles.divider12}></span>

          {/* Auction grades */}

          <section className={styles.filterSection}>
            <p className={styles.filterTitle}>Auction Grades</p>

            {auctionGrades.map((grade) => (
              <section key={grade.id} className={styles.filterRow}>
                <section className={styles.filterLeft}>
                  <input
                    type="checkbox"
                    id={`auction-grade-${grade.id}`}
                    defaultChecked={grade.checked}
                  />

                  <label htmlFor={`auction-grade-${grade.id}`}>
                    {grade.name}
                  </label>
                </section>
              </section>
            ))}
          </section>
        </section>
      </section>

      {/* Vehicle cards */}

      <section className={styles.vehicleGrid}>
        {currentVehicles.length > 0 ? (
          currentVehicles.map((vehicle) => (
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
                    href={`/inventory/${vehicle.slug}`}
                    className={styles.vehicleViewDetail}
                  >
                    View Detail &rarr;
                  </Link>
                </section>
              </section>
            </section>
          ))
        ) : (
          <p>No vehicles found.</p>
        )}

        {pageCount > 1 && (
          <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
        )}
      </section>
    </section>
  );
}
