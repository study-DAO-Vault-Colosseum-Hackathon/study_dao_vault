"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

function NavHeader({ tabs = [], activeTab, onTabClick }) {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      className="relative mx-auto flex w-fit rounded-full border-2 border-black bg-white p-1"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab}
          isActive={activeTab === tab}
          setPosition={setPosition}
          onClick={() => onTabClick?.(tab)}
        >
          {tab}
        </Tab>
      ))}
      <Cursor position={position} />
    </ul>
  );
}

function Tab({ children, setPosition, onClick, isActive }) {
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      onClick={onClick}
      className={`relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base ${isActive ? "font-bold" : ""}`}
    >
      {children}
    </li>
  );
}

function Cursor({ position }) {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 rounded-full bg-black md:h-12"
    />
  );
}

export default NavHeader;
