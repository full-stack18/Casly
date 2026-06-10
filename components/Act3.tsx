"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const LETTER = `Desde el momento en que te vi, hace ya tantos años, no he dejado de pensar en ti un solo día.

Y ahora que vuelvo a estar contigo sufro una agonía...

Soy prisionero del beso que nunca debiste haberme dado; mi corazón late esperando que ese beso no deje cicatriz alguna.

Estás muy dentro de mi alma, atormentándome.

Qué puedo hacer, haré todo lo que me pidas.`;

export default function Act3() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.4, once: true });
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!isInView || started) return;
    setStarted(true);
    const chars = LETTER.split("");
    let i = 0;
    let timeoutId: NodeJS.Timeout | number;

    function type() {
      if (i >= chars.length) { setDone(true); return; }
      setDisplayed(LETTER.slice(0, i + 1));
      const ch = chars[i++];
      const delay = ch === "." || ch === "," ? 220 : ch === "\n" ? 580 : 36;
      timeoutId = setTimeout(type, delay);
    }
    timeoutId = setTimeout(type, 700);

    return () => clearTimeout(timeoutId);
  }, [isInView, started]);

  const paragraphs = displayed.split("\n\n");

  return (
    <section id="act3" ref={ref}
      className="min-h-svh scroll-snap-start flex items-center justify-center px-6 py-20">
      <div className="max-w-xl w-full">

        <motion.p
          className="text-[0.65rem] tracking-[0.35em] uppercase mb-10"
          style={{ color: "var(--ink-faint)" }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          Para Casly
        </motion.p>

        <div className="font-serif-display font-light leading-[1.9] space-y-6"
          style={{ fontSize: "clamp(1.2rem, 3vw, 1.55rem)", color: "var(--ink)" }}>
          {paragraphs.map((p, i) => (
            <p key={i}>
              {p}
              {i === paragraphs.length - 1 && !done && (
                <motion.span
                  className="inline-block w-[2px] ml-[2px] align-middle"
                  style={{ height: "1.1em", background: "var(--rose)" }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1, ease: (v) => (v < 0.5 ? 0 : 1) }}
                />
              )}
            </p>
          ))}
        </div>

        <motion.p
          className="font-serif-display italic mt-14 text-lg"
          style={{ color: "var(--rose)" }}
          initial={{ opacity: 0, x: -10 }}
          animate={done ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          — Siempre tuyo
        </motion.p>
      </div>
    </section>
  );
}