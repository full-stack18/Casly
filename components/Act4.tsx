"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

type Particle = { x: number; y: number; vx: number; vy: number; alpha: number; size: number; sym: string; color: string };
const SYMS = ["✦", "·", "˙", "∘", "⋆"];

export default function Act4() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(ref, { amount: 0.5, once: true });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => { if (isInView) setTriggered(true); }, [isInView]);

  useEffect(() => {
    if (!triggered) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const particles: Particle[] = [];
    let animId: number;
    let frame = 0;

    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener("resize", resize);

    function spawn(x?: number, y?: number, burst = false) {
      const count = burst ? 18 : 1;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x ?? Math.random() * canvas.width,
          y: y ?? canvas.height + 10,
          vx: burst ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 1.2,
          vy: burst ? (Math.random() - 0.5) * 6 - 2 : -(Math.random() * 1.8 + 0.8),
          alpha: 0.85, size: Math.random() * 11 + 5,
          sym: burst ? "✦" : SYMS[Math.floor(Math.random() * SYMS.length)],
          color: Math.random() > 0.4 ? "rgba(201,160,160," : "rgba(240,236,228,"
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      if (frame % 6 === 0) spawn();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.alpha -= 0.004;
        if (p.alpha <= 0 || p.y < -20) { particles.splice(i, 1); continue; }
        ctx.font = `${p.size}px serif`;
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.fillText(p.sym, p.x, p.y);
      }
      animId = requestAnimationFrame(animate);
    }
    animate();

    const section = ref.current!;
    const onClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      spawn(e.clientX - r.left, e.clientY - r.top, true);
    };
    section.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      section.removeEventListener("click", onClick);
    };
  }, [triggered]);

  const words = ["Haré todo", "lo que me pidas."];

  return (
    <section id="act4" ref={ref}
      className="min-h-svh scroll-snap-start relative flex flex-col items-center justify-center gap-10 text-center px-6 overflow-hidden cursor-pointer">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="relative z-10">
        {words.map((line, i) => (
          <motion.p key={i}
            className="font-serif-display font-light italic leading-[1.4] block"
            style={{ fontSize: "clamp(1.8rem, 6vw, 3.2rem)", color: "var(--ink)" }}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={triggered ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.2, delay: 0.4 + i * 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <motion.p
        className="relative z-10 text-[0.6rem] tracking-[0.22em] uppercase"
        style={{ color: "var(--ink-faint)" }}
        initial={{ opacity: 0 }}
        animate={triggered ? { opacity: 1 } : {}}
        transition={{ delay: 1.8, duration: 1 }}
      >
        toca para crear magia
      </motion.p>

      <motion.button
        className="relative z-10 border text-[0.68rem] tracking-[0.22em] uppercase px-7 py-2.5 transition-colors duration-300"
        style={{ borderColor: "var(--ink-faint)", color: "var(--ink-dim)" }}
        whileHover={{ borderColor: "var(--rose)", color: "var(--rose-bright)" }}
        initial={{ opacity: 0 }}
        animate={triggered ? { opacity: 1 } : {}}
        transition={{ delay: 2.2, duration: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Volver a empezar
      </motion.button>
    </section>
  );
}