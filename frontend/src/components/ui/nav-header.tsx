
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

type NavHeaderItem = {
  label: string;
  value: string;
};

type CursorPosition = {
  left: number;
  width: number;
  opacity: number;
};

type NavHeaderProps = {
  items: NavHeaderItem[];
  activeItem: string;
  onItemClick: (value: string) => void;
  className?: string;
};

function NavHeader({ items, activeItem, onItemClick, className = "" }: NavHeaderProps) {
  const containerRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [position, setPosition] = useState<CursorPosition>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const activeValue = useMemo(() => {
    if (items.some((item) => item.value === activeItem)) {
      return activeItem;
    }

    return items[0]?.value ?? "";
  }, [activeItem, items]);

  const syncCursorToItem = (value: string, visible = true) => {
    const element = itemRefs.current[value];
    const container = containerRef.current;
    if (!element || !container) {
      return;
    }

    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setPosition({
      left: elementRect.left - containerRect.left,
      width: elementRect.width,
      opacity: visible ? 1 : 0,
    });
  };

  useLayoutEffect(() => {
    if (!activeValue) {
      return;
    }

    syncCursorToItem(activeValue);
  }, [activeValue]);

  useEffect(() => {
    const handleResize = () => {
      if (activeValue) {
        syncCursorToItem(activeValue);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeValue]);

  return (
    <ul
      ref={containerRef}
      className={`relative mx-auto flex w-fit max-w-full items-center rounded-full border border-black/15 bg-white p-1 shadow-sm ${className}`}
      onMouseLeave={() => syncCursorToItem(activeValue)}
    >
      {items.map((item) => (
        <li
          key={item.value}
          ref={(element) => {
            itemRefs.current[item.value] = element;
          }}
          className="relative"
        >
          <button
            type="button"
            onMouseEnter={() => syncCursorToItem(item.value)}
            onFocus={() => syncCursorToItem(item.value)}
            onClick={() => {
              syncCursorToItem(item.value);
              onItemClick(item.value);
            }}
            className="relative z-10 block cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white mix-blend-difference outline-none md:px-5 md:py-3 md:text-sm"
          >
            {item.label}
          </button>
        </li>
      ))}

      <Cursor position={position} />
    </ul>
  );
}

const Cursor = ({ position }: { position: CursorPosition }) => {
  return (
    <motion.li
      animate={position}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="absolute bottom-1 top-1 z-0 rounded-full bg-black"
    />
  );
};

export default NavHeader;
