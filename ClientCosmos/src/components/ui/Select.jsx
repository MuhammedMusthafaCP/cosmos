import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

/**
 * Accessible custom dropdown (button + listbox) that matches the site theme.
 *
 * Props: label (visible text before the control), value, onChange(value),
 * options: [{ value, label }], align: "left" | "right" (which edge the menu lines up with).
 * Keyboard: Enter/Space/ArrowDown open, arrows move, Home/End jump, Enter selects, Esc/Tab close.
 */
export default function Select({ label, value, onChange, options, align = "right", className = "" }) {
  const id = useId();
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );
  const selected = options[selectedIndex];

  const openMenu = () => {
    setActive(selectedIndex);
    setOpen(true);
  };

  const choose = (index) => {
    onChange(options[index].value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  // Close on outside click.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const onKeyDown = (e) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => (i + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => (i - 1 + options.length) % options.length);
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
    }
  };

  return (
    <div ref={rootRef} className={`relative inline-flex items-center gap-2 ${className}`}>
      {label && (
        <span id={`${id}-label`} className="text-sm text-gray-400">
          {label}
        </span>
      )}
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={label ? `${id}-label ${id}-button` : undefined}
        id={`${id}-button`}
        aria-activedescendant={open ? `${id}-option-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className="inline-flex min-w-[8.5rem] items-center justify-between gap-3 rounded-full border border-white/15 bg-white/5 py-1.5 pl-4 pr-3 text-sm font-medium text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        {selected?.label}
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={label ? `${id}-label` : undefined}
          className={`absolute top-full z-30 mt-2 min-w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-950 p-1 shadow-2xl shadow-black/60 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={`flex cursor-pointer items-center justify-between gap-6 whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                  index === active ? "bg-white/10 text-white" : "text-gray-300"
                }`}
              >
                {option.label}
                {isSelected && <Check className="h-4 w-4 text-sky-400" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
