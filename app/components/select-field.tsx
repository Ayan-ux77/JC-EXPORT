"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
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

/**
 * The box the menu must stay inside: the nearest ancestor that clips, or the
 * viewport. A dropdown that opens downwards out of a scrolling filter rail is
 * simply not there as far as the reader is concerned, which is worse than the
 * native menu this replaced.
 */
function clippingRect(node: HTMLElement | null): DOMRect {
  let element = node?.parentElement ?? null;
  while (element && element !== document.body) {
    const { overflow, overflowY } = getComputedStyle(element);
    if (overflow !== "visible" || overflowY !== "visible") {
      return element.getBoundingClientRect();
    }
    element = element.parentElement;
  }
  return new DOMRect(0, 0, window.innerWidth, window.innerHeight);
}

/**
 * Decided when the menu opens rather than measured after it renders: the
 * height is a function of the option count and whether there is a filter box,
 * both of which are known here, and measuring afterwards means painting once
 * in the wrong place first.
 */
function choosePlacement(
  node: HTMLElement | null,
  optionCount: number,
  withSearch: boolean,
): "bottom" | "top" {
  if (!node) {
    return "bottom";
  }
  const trigger = node.getBoundingClientRect();
  const bounds = clippingRect(node);
  const height =
    Math.min(LIST_MAX_HEIGHT, optionCount * OPTION_HEIGHT + 8) +
    (withSearch ? SEARCH_ROW_HEIGHT : 0);

  const below = bounds.bottom - trigger.bottom - MENU_GAP;
  const above = trigger.top - bounds.top - MENU_GAP;

  // Only flip when it actually helps: above a field near the top of a short
  // panel there may be even less room.
  return height > below && above > below ? "top" : "bottom";
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
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");

  const rootRef = useRef<HTMLDivElement>(null);
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

  // Close on an outside click or Escape, the two things every dropdown owes
  // the reader.
  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
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
    setPlacement(choosePlacement(rootRef.current, withPlaceholder.length, showSearch));
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

      {open && (
        <div className={styles.popover} data-placement={placement}>
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
        </div>
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
