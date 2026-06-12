"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Counter() {
  // Pon aquí la fecha exacta en la que se conocieron (Año-Mes-DíaTHoras:Minutos:Segundos)
  const START_DATE = "2022-05-14T00:00:00"; 
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const start = new Date(START_DATE).getTime();
    const update = () => {
      const now = new Date().getTime();
      const diff = now - start;
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };
    const interval = setInterval(update, 1000);
    update();
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }} className="flex gap-3 md:gap-6 text-center mt-8 border border-white/10 bg-white/5 backdrop-blur-sm p-4 rounded-xl">
      {[
        { label: "DÍAS", value: time.days },
        { label: "HORAS", value: time.hours },
        { label: "MINS", value: time.minutes },
        { label: "SEGS", value: time.seconds }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center min-w-[50px]">
          <span className="font-serif-display italic text-2xl md:text-3xl text-rose-300 drop-shadow-md">{item.value}</span>
          <span className="text-[8px] md:text-[10px] tracking-[0.2em] text-white/50">{item.label}</span>
        </div>
      ))}
    </motion.div>
  );
}