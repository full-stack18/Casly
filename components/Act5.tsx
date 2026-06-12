"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Act5({ onRestart }: { onRestart: () => void }) {
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 120, y: 80 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!accepted || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    // ── Floating hearts (background, slow) ──────────────────────────────
    type FloatHeart = { x: number; y: number; size: number; speed: number; swing: number; swingSpeed: number; angle: number };
    type BurstParticle = { x: number; y: number; vx: number; vy: number; alpha: number; size: number; decay: number };

    const floaters: FloatHeart[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 600,
      size: Math.random() * 15 + 10,
      speed: Math.random() * 1.6 + 0.8,   // slower
      swing: Math.random() * 2.5,
      swingSpeed: Math.random() * 0.025,
      angle: Math.random() * Math.PI * 2,
    }));

    // Burst particles pool
    const bursts: BurstParticle[] = [];

    const spawnBurst = (mx: number, my: number) => {
      const count = 18;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const speed = 2 + Math.random() * 5;
        bursts.push({
          x: mx, y: my,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          size: 10 + Math.random() * 14,
          decay: 0.022 + Math.random() * 0.015,
        });
      }
    };

    const handleClick = (e: MouseEvent) => spawnBurst(e.clientX, e.clientY);
    const handleTouch = (e: TouchEvent) => {
      Array.from(e.touches).forEach(t => spawnBurst(t.clientX, t.clientY));
    };
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchstart", handleTouch);

    let animId: number;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw floating background hearts
      ctx.fillStyle = "#E11D48";
      floaters.forEach(p => {
        p.y -= p.speed;
        p.angle += p.swingSpeed;
        if (p.y < -50) { p.y = canvas.height + 50; p.x = Math.random() * canvas.width; }
        const x = p.x + Math.sin(p.angle) * p.swing;
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.translate(x, p.y);
        ctx.font = `${p.size}px Arial`;
        ctx.fillText("❤", 0, 0);
        ctx.restore();
      });

      // Draw burst particles — all on same canvas, no DOM overhead
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.12; // gentle gravity
        b.vx *= 0.97;
        b.alpha -= b.decay;
        if (b.alpha <= 0) { bursts.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = b.alpha;
        // Warm pink-to-rose gradient per particle for richness
        ctx.fillStyle = b.alpha > 0.6 ? "#ff6b9d" : "#E11D48";
        ctx.shadowBlur = 10 * b.alpha;
        ctx.shadowColor = "rgba(255, 100, 150, 0.8)";
        ctx.translate(b.x, b.y);
        ctx.font = `${b.size}px Arial`;
        ctx.fillText("❤", 0, 0);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("resize", resize);
    };
  }, [accepted]);

  const dodgeHover = () => {
    if (accepted) return;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 90 + 160;
    setNoPosition({ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance });
  };

  return (
    <section className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-[#050508] px-4">

      {/* Subtle ambient pulse when accepted */}
      {accepted && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0, 0.12, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(225,29,72,0.35) 0%, transparent 65%)" }}
        />
      )}

      {/* Canvas — pointer-events only when accepted so buttons work before */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ pointerEvents: accepted ? "auto" : "none" }}
      />

      {!accepted && (
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 bg-rose-700/30 blur-[80px] rounded-full w-[300px] h-[300px] md:w-[600px] md:h-[600px] m-auto z-0 pointer-events-none"
        />
      )}

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div key="question" className="z-10 flex flex-col items-center w-full"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}>

            {/* Subtle floating hearts decoration */}
            {[...Array(5)].map((_, i) => (
              <motion.span key={i}
                className="absolute text-rose-500/20 pointer-events-none select-none"
                style={{ left: `${12 + i * 18}%`, top: `${15 + (i % 3) * 20}%`, fontSize: `${14 + i * 4}px` }}
                animate={{ y: [0, -18, 0], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 3 + i * 0.7, repeat: Infinity, delay: i * 0.5 }}
              >❤</motion.span>
            ))}

            <h1 className="font-serif-display italic text-3xl md:text-5xl lg:text-6xl mb-16 md:mb-24 text-center leading-tight drop-shadow-2xl">
              Asly Melanie Rodriguez Reyes...<br />
              <span className="text-rose-300">¿Quieres ser mi novia?</span>
            </h1>

            <div className="relative flex items-center justify-center w-full max-w-[400px] h-[250px]">
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: "0px 0px 40px rgba(255, 180, 180, 0.6)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAccepted(true)}
                className="absolute z-20 px-10 py-4 md:px-14 md:py-5 bg-white text-rose-900 font-serif-display text-2xl md:text-3xl rounded-full shadow-2xl transition-shadow"
              >
                Sí, quiero ❤
              </motion.button>

              <motion.button
                onMouseEnter={dodgeHover} onClick={dodgeHover}
                animate={{ x: noPosition.x, y: noPosition.y }}
                transition={{ type: "spring", stiffness: 250, damping: 15 }}
                className="absolute z-10 px-8 py-3 md:px-10 md:py-4 border border-white/20 text-white/60 font-serif-display text-lg md:text-xl rounded-full bg-black/60 backdrop-blur-md cursor-pointer"
              >
                No
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="accepted" className="z-20 flex flex-col items-center justify-center w-full h-full text-center px-4 pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="fixed inset-0 bg-white pointer-events-none z-[-1]"
              initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} />

            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring" }} className="flex flex-col items-center">
              <h2 className="font-serif-display italic text-5xl md:text-8xl text-rose-300 mb-4 drop-shadow-[0_0_30px_rgba(255,180,180,0.5)]">
                ¡Te amo, Asly!
              </h2>
              <p className="text-[10px] md:text-sm tracking-[0.4em] uppercase text-white/80 font-light mb-4">
                El inicio de nuestra historia
              </p>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 2 }}
                className="font-serif-display italic text-rose-300/80 text-sm mb-10"
              >
                toca donde quieras ❤
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
                onClick={onRestart}
                className="pointer-events-auto flex items-center justify-center gap-2 border border-white/20 px-8 py-3 rounded-full text-[10px] md:text-xs tracking-widest uppercase text-white/60 hover:bg-white/10 hover:text-white transition-all"
              >
                <span className="text-lg leading-none">⟲</span> Volver a ver
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}