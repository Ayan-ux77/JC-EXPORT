"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import type { CurrencyRates } from "@/data/currency";
import styles from "./currency-switcher.module.css";

type CurrencySwitcherProps = {
  rates: CurrencyRates;
  /** The code currently shown beside USD, if any. */
  active?: string;
  /** Where the default came from, so the buyer knows nothing was assumed about them. */
  fromDestination?: boolean;
};

/**
 * Which money the buyer wants to see beside the USD price.
 *
 * Stored in a cookie rather than the URL: unlike a destination port, nobody
 * shares a link meaning "show this in shillings", and reading it on the
 * server means the first paint already carries the right figures instead of
 * swapping them after hydration.
 */
export function CurrencySwitcher({ rates, active, fromDestination }: CurrencySwitcherProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(code: string) {
    try {
      document.cookie =
        code === rates.base
          ? "jc_currency=; path=/; max-age=0; samesite=lax"
          : `jc_currency=${encodeURIComponent(code)}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // A browser refusing cookies just means the choice lasts one render.
    }

    // The prices are rendered on the server, so the server has to hear about
    // it. A transition keeps the old figures on screen while it does.
    startTransition(() => router.refresh());
  }

  return (
    <div className={styles.wrap} data-pending={pending ? "true" : "false"}>
      <span className={styles.label}>Show prices in</span>
      <div className={styles.options} role="group" aria-label="Display currency">
        <button
          type="button"
          aria-pressed={!active}
          onClick={() => choose(rates.base)}
        >
          {rates.base}
        </button>
        {rates.rates.map((rate) => (
          <button
            key={rate.code}
            type="button"
            aria-pressed={active === rate.code}
            onClick={() => choose(rate.code)}
          >
            {rate.code}
          </button>
        ))}
      </div>
      {active && (
        <span className={styles.note}>
          {fromDestination ? "Matched to your destination. " : ""}
          Approximate, at {rates.as_of} rates. JC invoices in {rates.base}.
        </span>
      )}
    </div>
  );
}
