"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Heart, Trash2 } from "lucide-react";

import { useShortlist } from "@/data/shortlist";
import { formatVehiclePrice, mediaSrc, type Vehicle } from "@/data/vehicles";
import styles from "./page.module.css";

/**
 * The cars this buyer is keeping.
 *
 * A client page on purpose: what is saved lives in this browser and never
 * reaches the server, so there is nothing for a server render to know. The
 * vehicles themselves are fetched by slug through the site's own API proxy,
 * which means a saved car that has since sold simply drops out rather than
 * showing a price that is no longer real.
 */
export default function SavedPage() {
  const { saved, remove, clear } = useShortlist();
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (saved.length === 0) {
      setVehicles([]);

      return;
    }

    Promise.all(
      saved.map((slug) =>
        fetch(`/api/vehicles/${encodeURIComponent(slug)}`)
          .then((response) => (response.ok ? response.json() : null))
          .catch(() => null),
      ),
    ).then((results) => {
      if (!cancelled) {
        setVehicles(results.filter(Boolean) as Vehicle[]);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [saved]);

  const missing = vehicles ? saved.length - vehicles.length : 0;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.head}>
          <div>
            <p className={styles.kicker}>Your shortlist</p>
            <h1>Saved vehicles</h1>
            <p className={styles.lede}>
              Kept in this browser. Nothing is sent to us until you make an
              enquiry.
            </p>
          </div>
          {saved.length > 0 && (
            <button type="button" className={styles.clear} onClick={clear}>
              <Trash2 aria-hidden="true" /> Clear all
            </button>
          )}
        </header>

        {vehicles === null && <p className={styles.state}>Loading your saved vehicles…</p>}

        {vehicles !== null && saved.length === 0 && (
          <div className={styles.empty}>
            <Heart aria-hidden="true" />
            <strong>Nothing saved yet</strong>
            <p>
              Tap the heart on any vehicle to keep it here while you compare.
            </p>
            <Link href="/vehicles">Browse vehicles</Link>
          </div>
        )}

        {vehicles !== null && vehicles.length > 0 && (
          <>
            {/* A car that has sold since it was saved is not an error worth
                shouting about, but saying nothing would look like the page
                lost it. */}
            {missing > 0 && (
              <p className={styles.state}>
                {missing} saved {missing === 1 ? "vehicle is" : "vehicles are"} no
                longer listed.
              </p>
            )}

            <div className={styles.grid}>
              {vehicles.map((vehicle) => (
                <article key={vehicle.slug} className={styles.card}>
                  <Link href={`/vehicles/${vehicle.slug}`} className={styles.image}>
                    <Image
                      src={mediaSrc(vehicle.image)}
                      alt={vehicle.title}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    />
                  </Link>

                  <div className={styles.body}>
                    <div className={styles.meta}>
                      <span>{vehicle.brand}</span>
                      <span>{vehicle.stock}</span>
                    </div>
                    <h2>
                      <Link href={`/vehicles/${vehicle.slug}`}>{vehicle.title}</Link>
                    </h2>
                    <div className={styles.footer}>
                      <div>
                        <small>
                          {vehicle.priceIsEstimate ? "Guide price" : "FOB price"}
                        </small>
                        <strong>
                          {vehicle.priceIsEstimate ? "from " : ""}
                          {formatVehiclePrice(vehicle)}
                        </strong>
                      </div>
                      <div className={styles.actions}>
                        <button
                          type="button"
                          onClick={() => remove(vehicle.slug)}
                          aria-label={`Remove ${vehicle.title} from saved`}
                        >
                          <Trash2 aria-hidden="true" />
                        </button>
                        <Link href={`/vehicles/${vehicle.slug}`}>
                          View <ArrowUpRight aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
