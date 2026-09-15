"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Cars the buyer is keeping an eye on.
 *
 * Buyers in this trade compare five or ten vehicles over several days before
 * they commit, and until now the only way to keep one was a browser tab or a
 * WhatsApp message to yourself.
 *
 * Deliberately not Redux: this is one array of slugs. useSyncExternalStore is
 * React's own answer for an external store shared across components, it has a
 * server snapshot so SSR and hydration agree, and it costs no dependency and
 * no Provider wrapping pages that are otherwise server-rendered.
 *
 * localStorage rather than a cookie: it never needs to reach the server, and
 * sending a list of everything a buyer is considering on every request would
 * be both wasteful and none of the server's business.
 */
const KEY = "jc_shortlist";
const LIMIT = 60;

type Listener = () => void;

const listeners = new Set<Listener>();

/**
 * The snapshot React compares between renders. It must be the SAME array
 * reference when nothing has changed, or useSyncExternalStore re-renders on
 * every tick and eventually throws about an infinite loop.
 */
let snapshot: string[] = [];
let loaded = false;

/** One empty array for every server render, for the same reason. */
const SERVER_SNAPSHOT: string[] = [];

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed)
      ? parsed.filter((slug): slug is string => typeof slug === "string")
      : [];
  } catch {
    // Private windows, cleared site data, a quota error mid-write: the
    // shortlist is a convenience, so losing it must never break the page.
    return [];
  }
}

function write(next: string[]) {
  snapshot = next;

  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Kept in memory for this session even when it cannot be persisted.
  }

  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  if (!loaded) {
    snapshot = read();
    loaded = true;
  }

  listeners.add(listener);

  // Two tabs open on the same catalogue should not disagree about what is
  // saved. The storage event fires only in the OTHER tabs, which is exactly
  // the case this handles.
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      snapshot = read();
      listeners.forEach((l) => l());
    }
  };

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): string[] {
  if (!loaded) {
    snapshot = read();
    loaded = true;
  }

  return snapshot;
}

function getServerSnapshot(): string[] {
  return SERVER_SNAPSHOT;
}

export function useShortlist() {
  const saved = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((slug: string) => {
    const current = getSnapshot();

    write(
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : // Newest first, and capped: a list of hundreds is not a shortlist,
          // and it would make the saved page fetch forever.
          [slug, ...current].slice(0, LIMIT),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    write(getSnapshot().filter((item) => item !== slug));
  }, []);

  const clear = useCallback(() => write([]), []);

  return { saved, toggle, remove, clear, has: (slug: string) => saved.includes(slug) };
}
