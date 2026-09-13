"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";

import styles from "./select-field.module.css";

export type SelectOption = { value: string; label: string };

type SelectFieldProps = {
  name?: string;
  options: SelectOption[];
  /** Shown when nothing is chosen. Doubles as the empty option's label. */
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Accessible name when there is no visible <label> wrapping this. */
  ariaLabel?: string;
  /** Force the filter box on or off; by default it appears once a list is long
   *  enough that scanning it beats reading it. */
  searchable?: boolean;
  /** "dark" for the glass panels over photography, "light" everywhere else. */
  tone?: "light" | "dark";
  className?: string;
  disabled?: boolean;
};

const SEARCH_THRESHOLD = 8;

const OPTION_HEIGHT = 36;
const LIST_MAX_HEIGHT = 264;
const SEARCH_ROW_HEIGHT = 42;
const MENU_GAP = 8;
/** Keeps the menu off the very edge of the screen. */
const VIEWPORT_MARGIN = 8;
/** Below this a menu is useless; better to overlap the field than to show a sliver. */
const MIN_MENU_HEIGHT = 132;

/**
 * Where the menu goes, in viewport coordinates.
 *
 * The menu is portalled to <body> and positioned fixed, so the only box it has
 * to stay inside is the viewport. That is the point of the portal: the old
 * absolutely-positioned menu was a child of whatever contained the field, and
 * on the home page that is the hero -- which sets `overflow: hidden` and
 * `isolation: isolate`. The list was therefore clipped at the hero's edge and
 * painted underneath the sticky header, so on a phone the first option was cut
 * in half and the rest sat behind the logo. Nothing a z-index could reach.
 */
type MenuPosition = {
  left: number;
  width: number;
  top: number;
  maxHeight: number;
};

function measure(
  node: HTMLElement | null,
  optionCount: number,
  withSearch: boolean,
): MenuPosition | null {
  if (!node) {
    return null;
  }
  const trigger = node.getBoundingClientRect();
  const wanted =
    Math.min(LIST_MAX_HEIGHT, optionCount * OPTION_HEIGHT + 8) +
    (withSearch ? SEARCH_ROW_HEIGHT : 0);

  const below = window.innerHeight - trigger.bottom - MENU_GAP - VIEWPORT_MARGIN;
  const above = trigger.top - MENU_GAP - VIEWPORT_MARGIN;

  // Only flip up when it actually helps: above a field near the top of the
  // page there may be even less room than below it.
  const flip = wanted > below && above > below;
  const maxHeight = Math.max(MIN_MENU_HEIGHT, Math.min(wanted, flip ? above : below));

  // Held inside the viewport horizontally. A field close to the right edge
  // would otherwise put half its menu off the side of the screen -- fixed
  // positioning has no containing block to be pushed back by.
  const width = Math.min(trigger.width, window.innerWidth - VIEWPORT_MARGIN * 2);
  const left = Math.min(
    Math.max(VIEWPORT_MARGIN, trigger.left),
    window.innerWidth - width - VIEWPORT_MARGIN,
  );

  // Clamped vertically for the same reason as horizontally. In normal use the
  // flip above already keeps the menu on screen; this covers the case where
  // the field itself is out of view when the menu opens, so the menu lands
  // somewhere visible instead of following it off the edge.
  const wantedTop = flip ? trigger.top - MENU_GAP - maxHeight : trigger.bottom + MENU_GAP;
  const top = Math.min(
    Math.max(VIEWPORT_MARGIN, wantedTop),
    Math.max(VIEWPORT_MARGIN, window.innerHeight - maxHeight - VIEWPORT_MARGIN),
  );

  return { left, width, top, maxHeight };
}

/** True once the field has scrolled out of sight in either direction. */
function offScreen(rect: DOMRect): boolean {
  return (
    rect.bottom < 0 ||
    rect.top > window.innerHeight ||
    rect.right < 0 ||
    rect.left > window.innerWidth
  );
}

/**
 * A select that looks the same in every browser.
 *
 * A native <select> hands its dropdown to the operating system: on this site
 * that meant a grey system menu with its own typeface and a blue highlight
 * landing on top of a dark glass panel, which is the one part of the page the
 * design could not touch. This renders the list itself, and filters it once
 * there are enough options that a buyer would rather type "Prado" than hunt
 * for it.
 *
 * The real form control is still a <select>, kept for the no-JavaScript case
 * inside <noscript> -- the hero search is a plain GET form and should keep
 * working without us -- plus a hidden input carrying the value when JS is on.
 */
export function SelectField({
  name,
  options,
  placeholder = "Any",
  value,
  defaultValue = "",
  onChange,
  ariaLabel,
  searchable,
  tone = "light",
  className,
  disabled = false,
}: SelectFieldProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? value : internal;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState<MenuPosition | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const withPlaceholder = useMemo<SelectOption[]>(
    () => [{ value: "", label: placeholder }, ...options],
    [options, placeholder],
  );

  const showSearch = searchable ?? options.length >= SEARCH_THRESHOLD;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return withPlaceholder;
    }
    // The placeholder is an action ("any make"), not a result, so it drops out
    // of a filtered list rather than sitting at the top of every search.
    return withPlaceholder.filter(
      (option) => option.value !== "" && option.label.toLowerCase().includes(needle),
    );
  }, [withPlaceholder, query]);

  const selectedLabel =
    withPlaceholder.find((option) => option.value === current)?.label ?? placeholder;

  const reposition = useCallback(() => {
    setPosition(measure(rootRef.current, withPlaceholder.length, showSearch));
  }, [showSearch, withPlaceholder.length]);

  // Close on an outside click or Escape, the two things every dropdown owes
  // the reader.
  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      // The menu is portalled out of the root, so "outside" has to mean
      // outside both boxes -- otherwise pointerdown on an option would close
      // the menu before the click that selects it ever landed.
      if (!rootRef.current?.contains(target) && !popoverRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Focus only -- opening and closing set the highlight and clear the filter
  // themselves, because doing that from an effect means rendering once with
  // last time's highlight before correcting it.
  useEffect(() => {
    if (open && showSearch) {
      searchRef.current?.focus();
    }
  }, [open, showSearch]);

  // A fixed menu does not travel with the page, so it is re-aimed on every
  // scroll and resize. `true` on the scroll listener catches scrolling
  // containers as well as the window -- the filter rail on the listing page
  // is one. If the field itself scrolls out of sight the menu closes rather
  // than hanging in mid-air.
  useEffect(() => {
    if (!open) {
      return;
    }
    const sync = () => {
      const trigger = rootRef.current?.getBoundingClientRect();
      if (!trigger || offScreen(trigger)) {
        setOpen(false);
        return;
      }
      reposition();
    };
    window.addEventListener("scroll", sync, true);
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync, true);
      window.removeEventListener("resize", sync);
    };
  }, [open, reposition]);

  useEffect(() => {
    if (!open) {
      return;
    }
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function openMenu() {
    const index = withPlaceholder.findIndex((option) => option.value === current);
    setActiveIndex(index >= 0 ? index : 0);
    setQuery("");
    reposition();
    setOpen(true);
  }

  function closeMenu() {
    setQuery("");
    setOpen(false);
  }

  function commit(next: string) {
    if (!isControlled) {
      setInternal(next);
    }
    onChange?.(next);
    closeMenu();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeMenu();
      return;
    }
    if (!open && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openMenu();
      return;
    }
    if (!open) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, visible.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(visible.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = visible[activeIndex];
      if (option) {
        commit(option.value);
      }
    } else if (event.key === "Tab") {
      closeMenu();
    }
  }

  return (
    <div
      ref={rootRef}
      className={[styles.root, styles[tone], className].filter(Boolean).join(" ")}
      data-open={open || undefined}
    >
      {name && <input type="hidden" name={name} value={current} />}

      <button
        type="button"
        className={styles.trigger}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        <span className={current ? styles.valueSet : styles.valueEmpty}>{selectedLabel}</span>
        <ChevronDown aria-hidden="true" className={styles.chevron} />
      </button>

      {open && position && createPortal(
        <div
          ref={popoverRef}
          className={styles.popover}
          data-tone={tone}
          style={{
            left: position.left,
            width: position.width,
            top: position.top,
            maxHeight: position.maxHeight,
          }}
        >
          {showSearch && (
            <div className={styles.searchRow}>
              <Search aria-hidden="true" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Type to filter..."
                aria-label="Filter options"
                autoComplete="off"
              />
            </div>
          )}

          <ul className={styles.list} id={listId} role="listbox" ref={listRef} tabIndex={-1}>
            {visible.map((option, index) => (
              <li
                key={option.value || "__any"}
                data-index={index}
                role="option"
                aria-selected={option.value === current}
                data-active={index === activeIndex || undefined}
                className={styles.option}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => commit(option.value)}
              >
                <span>{option.label}</span>
                {option.value === current && <Check aria-hidden="true" />}
              </li>
            ))}
            {visible.length === 0 && <li className={styles.noMatch}>No matches</li>}
          </ul>
        </div>,
        document.body,
      )}

      {/* Without JavaScript the button above does nothing, so the real control
          is here. Browsers never build DOM for this when scripting is on, so
          there is no duplicate field in the submitted form. */}
      {name && (
        <noscript>
          <select name={name} defaultValue={current} className={styles.nativeFallback}>
            {withPlaceholder.map((option) => (
              <option key={option.value || "__any"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </noscript>
      )}
    </div>
  );
}
