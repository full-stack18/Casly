"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Act2({ onNext }: { onNext: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 4000);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let stars: any[] = [];
    let meteors: any[] = [];
    let mouse = { x: -9999, y: -9999 };

    function spawnMeteor() {
      meteors.push({
        x: Math.random() * canvas.width * 1.4,
        y: -20,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 5,
        trail: [] as { x: number; y: number }[],
        size: Math.random() * 1.5 + 0.5,
        done: false,
      });
    }

    function init() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 800 }, () => ({
        ox: Math.random() * canvas.width, oy: Math.random() * canvas.height,
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.2, alpha: Math.random(),
        velocity: Math.random() * 0.03 + 0.01,
        isBright: Math.random() > 0.95,
      }));
      meteors = [];
    }

    const meteorInterval = setInterval(spawnMeteor, 1800);
    spawnMeteor();

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach(s => {
        s.alpha += s.velocity;
        if (s.alpha <= 0.1 || s.alpha >= 1) s.velocity *= -1;

        const dx = mouse.x - s.x, dy = mouse.y - s.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 120) {
          const force = (120 - dist) / 120;
          // Warm rose bloom
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r + force * 10);
          grad.addColorStop(0, `rgba(255,190,210,${force * 0.95})`);
          grad.addColorStop(0.5, `rgba(255,140,170,${force * 0.45})`);
          grad.addColorStop(1, "transparent");
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r + force * 10, 0, Math.PI * 2);
          ctx.fillStyle = grad; ctx.fill();
          // Sparkle cross
          if (force > 0.45) {
            ctx.save();
            ctx.strokeStyle = `rgba(255,220,230,${(force - 0.45) * 1.8})`;
            ctx.lineWidth = 0.6;
            const arm = s.r + force * 7;
            ctx.beginPath(); ctx.moveTo(s.x - arm, s.y); ctx.lineTo(s.x + arm, s.y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(s.x, s.y - arm); ctx.lineTo(s.x, s.y + arm); ctx.stroke();
            ctx.restore();
          }
        } else {
          s.x += (s.ox - s.x) * 0.05;
          s.y += (s.oy - s.y) * 0.05;
        }

        ctx.beginPath(); ctx.arc(s.x, s.y, s.isBright ? s.r * 1.5 : s.r, 0, Math.PI * 2);
        if (s.isBright && s.alpha > 0.8) {
          ctx.fillStyle = "rgba(255,255,255,1)"; ctx.shadowBlur = 10; ctx.shadowColor = "rgba(255,255,255,0.8)";
        } else {
          ctx.fillStyle = `rgba(255,255,255,${Math.abs(s.alpha)})`; ctx.shadowBlur = 0;
        }
        ctx.fill();
      });

      ctx.shadowBlur = 0;

      // Meteors
      meteors = meteors.filter(m => !m.done);
      meteors.forEach(m => {
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.trail.push({ x: m.x, y: m.y });
        if (m.trail.length > 32) m.trail.shift();
        if (m.x > canvas.width + 100 || m.y > canvas.height + 100) { m.done = true; return; }

        for (let i = 1; i < m.trail.length; i++) {
          const t = i / m.trail.length;
          ctx.beginPath();
          ctx.moveTo(m.trail[i - 1].x, m.trail[i - 1].y);
          ctx.lineTo(m.trail[i].x, m.trail[i].y);
          ctx.strokeStyle = `rgba(255,235,255,${t * 0.92})`;
          ctx.lineWidth = m.size * t;
          ctx.shadowBlur = 9 * t;
          ctx.shadowColor = "rgba(255,200,255,0.85)";
          ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(m.x, m.y, m.size + 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.97)";
        ctx.shadowBlur = 18; ctx.shadowColor = "rgba(255,220,255,1)";
        ctx.fill(); ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(draw);
    }

    const handleMove = (e: any) => {
      mouse.x = e.touches ? e.touches[0].clientX : e.clientX;
      mouse.y = e.touches ? e.touches[0].clientY : e.clientY;
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("resize", init);
    init(); draw();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(meteorInterval);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="relative w-full h-full overflow-hidden cursor-crosshair bg-black"
      style={{ backgroundImage: "url('/universo.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Text content */}
      <div className="absolute top-[12%] w-full flex flex-col items-center gap-4 z-10 pointer-events-none px-6">
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="text-sm md:text-lg uppercase text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] font-light text-center">
          Pide un deseo...
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5, duration: 2 }}
          className="font-serif-display italic text-rose-300/75 text-sm md:text-base tracking-wide text-center max-w-xs md:max-w-md">
          yo ya pedí el mío: tenerte siempre
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 5, duration: 2 }}
          className="text-[10px] tracking-[0.35em] uppercase text-rose-200/40 font-light text-center">
          nuestro universo · contigo
        </motion.p>
      </div>

      {/* Subtle floating hearts in corners */}
      {[
        { x: "8%", y: "70%" }, { x: "88%", y: "60%" }, { x: "15%", y: "85%" }, { x: "80%", y: "80%" }
      ].map((pos, i) => (
        <motion.span key={i}
          className="absolute text-rose-400/35 pointer-events-none select-none"
          style={{ left: pos.x, top: pos.y, fontSize: `${12 + i * 3}px` }}
          animate={{ y: [0, -14, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i * 0.8, repeat: Infinity, delay: i * 1.1 }}
        >
          {i % 2 === 0 ? "❤" : "♡"}
        </motion.span>
      ))}

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 6, duration: 2 }}
        className="absolute bottom-[22%] w-full text-center font-serif-display italic text-rose-200/40 text-xs md:text-sm pointer-events-none z-10 px-6"
      >
        cada estrella brilla por ti
      </motion.p>

      <AnimatePresence>
        {showButton && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-16 w-full flex flex-col items-center gap-3 z-20">
            <button onClick={onNext}
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-3 tracking-[0.2em] text-sm uppercase hover:bg-white hover:text-black transition-all rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Continuar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}