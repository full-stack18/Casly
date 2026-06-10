"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const sections = ["act1", "act2", "act3", "act4", "act5"];

export default function NavDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observers = sections.map((id, i) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(i); },
        { threshold: 0.55 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  return (
    <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {sections.map((id, i) => (
        <motion.button
          key={id}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
          animate={{ scale: active === i ? 1.8 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-[5px] h-[5px] rounded-full transition-colors duration-500"
          style={{ background: active === i ? "var(--rose)" : "var(--ink-faint)" }}
        />
      ))}
    </nav>
  );
}