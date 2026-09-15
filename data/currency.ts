/**
 * Money, as the buyer reads it.
 *
 * Deliberately free of any server import. These types and helpers are used
 * by client components on the cards, and pulling in the data layer here
 * would drag "server-only" into the browser bundle -- which is exactly the
 * build error this file caused the first time round. Fetching the rates
 * lives with the other server calls, in vehicle-service.
 */
export type CurrencyRate = {
  code: string;
  symbol: string;
  rate: number;
};

export type CurrencyRates = {
  base: string;
  as_of: string;
  /**
   * The money of the country the buyer is shipping to, when a port has been
   * chosen and the ERP knows its currency. The server resolves it because
   * only the server knows which port belongs to which country -- and because
   * it is the same lookup that decides whether that currency is in `rates`
   * at all. Null means: show USD, assume nothing.
   */
  local?: string | null;
  rates: CurrencyRate[];
};

/** What the site converts a USD price into, when the buyer has chosen one. */
export type LocalPrice = {
  code: string;
  symbol: string;
  rate: number;
  asOf: string;
};

/**
 * The currency to show alongside USD.
 *
 * Preference order: what the buyer picked, then what the country they are
 * shipping to uses, then nothing -- USD alone, which is honest rather than a
 * guess at someone's wallet from an IP address.
 */
export function resolveLocalPrice(
  rates: CurrencyRates | null,
  chosen?: string,
  destinationCurrency?: string,
): LocalPrice | null {
  if (!rates) {
    return null;
  }

  const wanted = (chosen || destinationCurrency || "").toUpperCase();

  if (!wanted || wanted === rates.base) {
    return null;
  }

  const match = rates.rates.find((rate) => rate.code === wanted);

  return match
    ? { code: match.code, symbol: match.symbol, rate: match.rate, asOf: rates.as_of }
    : null;
}

/**
 * A USD figure in the buyer's money, rounded to something a person would say.
 *
 * Deliberately coarse. 1,529,347 shillings reads as a precision JC does not
 * have -- the rate is yesterday's and the bank's will differ -- so it rounds
 * to three significant figures and is always shown with "approx".
 */
export function formatLocal(usd: number | null, local: LocalPrice | null): string | null {
  if (usd == null || !local) {
    return null;
  }

  const converted = usd * local.rate;

  if (!Number.isFinite(converted) || converted <= 0) {
    return null;
  }

  const magnitude = Math.pow(10, Math.max(0, Math.floor(Math.log10(converted)) - 2));
  const rounded = Math.round(converted / magnitude) * magnitude;

  // "KSh1,650,000" is not how anyone writes it. A symbol made of letters
  // takes a space; a glyph does not -- nobody writes "$ 12,750" either. The
  // single-letter ones (R, P, K) follow their own local convention and close
  // up, which is why the test is length as well as script.
  const separator = local.symbol.length > 1 && /[A-Za-z]$/.test(local.symbol) ? " " : "";

  return `${local.symbol}${separator}${rounded.toLocaleString("en-US")}`;
}
