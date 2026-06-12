"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "./Typewriter";

const LOVE_WHISPERS = ["te amo", "mi todo", "para ti", "mi princesa", "contigo", "siempre"];

type Petal = {
  x: number; y: number; vx: number; vy: number;
  scale: number; depth: number;
  swayPhase: number; swayAmp: number; swayFreq: number;
  rot: number; rotVel: number;
  flip: number; flipSpeed: number;
  alpha: number; hue: number; lightness: number;
  curl: number; asym: number;
};

function drawRealisticPetal(ctx: CanvasRenderingContext2D, p: Petal) {
  const depthScale = 0.55 + p.depth * 0.65;
  const s = p.scale * depthScale;
  const flipX = Math.cos(p.flip);

  ctx.save();
  ctx.globalAlpha = p.alpha * (0.45 + p.depth * 0.55);
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.scale(s * flipX, s * (0.88 + Math.abs(Math.sin(p.flip)) * 0.12));

  ctx.shadowBlur = 3 + (1 - p.depth) * 4;
  ctx.shadowColor = "rgba(60, 15, 30, 0.3)";
  ctx.shadowOffsetY = 1.5;

  // Pétalo orgánico — asimétrico, punta fina, base ancha
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.bezierCurveTo(4 + p.asym, -11, 9 + p.curl, -3, 7.5, 5);
  ctx.bezierCurveTo(6, 9.5, 2.5, 12, 0, 11.5);
  ctx.bezierCurveTo(-2.5, 12, -6, 9.5, -7.5, 5);
  ctx.bezierCurveTo(-9 - p.curl, -3, -4 - p.asym, -11, 0, -14);
  ctx.closePath();

  const grad = ctx.createLinearGradient(-6, -14, 6, 12);
  grad.addColorStop(0, `hsla(${p.hue}, 48%, ${p.lightness + 20}%, 0.98)`);
  grad.addColorStop(0.25, `hsla(${p.hue}, 62%, ${p.lightness + 10}%, 0.94)`);
  grad.addColorStop(0.55, `hsla(${p.hue}, 68%, ${p.lightness}%, 0.88)`);
  grad.addColorStop(0.85, `hsla(${p.hue}, 58%, ${p.lightness - 10}%, 0.7)`);
  grad.addColorStop(1, `hsla(${p.hue}, 45%, ${p.lightness - 18}%, 0.45)`);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Vena principal
  ctx.strokeStyle = `hsla(${p.hue}, 38%, ${p.lightness - 20}%, 0.4)`;
  ctx.lineWidth = 0.55;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.quadraticCurveTo(p.curl * 0.4, 1, 0, 10);
  ctx.stroke();

  // Venas laterales
  ctx.strokeStyle = `hsla(${p.hue}, 32%, ${p.lightness - 15}%, 0.18)`;
  ctx.lineWidth = 0.35;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.quadraticCurveTo(side * 4, 0, side * 3, 6);
    ctx.stroke();
  }

  // Brillo — luz que entra por un lado
  ctx.fillStyle = `hsla(${p.hue}, 35%, ${p.lightness + 25}%, 0.28)`;
  ctx.beginPath();
  ctx.ellipse(-3, -4, 2.8, 5.5, -0.45, 0, Math.PI * 2);
  ctx.fill();

  // Sombra interna en la curvatura
  ctx.fillStyle = `hsla(${p.hue}, 55%, ${p.lightness - 22}%, 0.12)`;
  ctx.beginPath();
  ctx.ellipse(3.5, 2, 3, 5, 0.35, 0, Math.PI * 2);
  ctx.fill();

  // Borde delicado
  ctx.strokeStyle = `hsla(${p.hue}, 45%, ${p.lightness - 6}%, 0.22)`;
  ctx.lineWidth = 0.35;
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.bezierCurveTo(4 + p.asym, -11, 9 + p.curl, -3, 7.5, 5);
  ctx.bezierCurveTo(6, 9.5, 2.5, 12, 0, 11.5);
  ctx.bezierCurveTo(-2.5, 12, -6, 9.5, -7.5, 5);
  ctx.bezierCurveTo(-9 - p.curl, -3, -4 - p.asym, -11, 0, -14);
  ctx.stroke();

  ctx.restore();
}

function createPetal(w: number, h: number, spreadY = true): Petal {
  const depth = Math.random();
  return {
    x: Math.random() * w,
    y: spreadY ? Math.random() * h - h * 0.2 : -30 - Math.random() * 80,
    vx: (Math.random() - 0.5) * 0.3,
    vy: 0.15 + depth * 0.2,
    scale: 0.7 + Math.random() * 0.5,
    depth,
    swayPhase: Math.random() * Math.PI * 2,
    swayAmp: 0.8 + Math.random() * 1.2,
    swayFreq: 0.012 + Math.random() * 0.018,
    rot: Math.random() * Math.PI * 2,
    rotVel: (Math.random() - 0.5) * 0.018,
    flip: Math.random() * Math.PI * 2,
    flipSpeed: 0.025 + Math.random() * 0.035,
    alpha: 0.65 + Math.random() * 0.35,
    hue: 338 + Math.random() * 22,
    lightness: 58 + Math.random() * 14,
    curl: (Math.random() - 0.5) * 3,
    asym: (Math.random() - 0.5) * 2,
  };
}

export default function Act1({ onNext, onPlayMusic }: { onNext: () => void; onPlayMusic: () => void; isPlaying: boolean }) {
  const [show, setShow] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { setShow(true); }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let petals: Petal[] = [];
    let animId = 0;
    let lastTime = 0;
    let windTime = 0;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      petals = Array.from({ length: 42 }, () => createPetal(canvas.width, canvas.height));
    };

    const updatePetal = (p: Petal, dt: number) => {
      windTime += dt * 0.001;
      const wind = Math.sin(windTime * 0.7) * 0.12 + Math.sin(windTime * 1.3 + p.swayPhase) * 0.06;

      // Gravedad suave con velocidad terminal — caída natural
      const terminal = 0.28 + p.depth * 0.38;
      p.vy = Math.min(p.vy + 0.004 * dt, terminal);

      // Balanceo lateral como hoja/pétalo en el aire
      p.swayPhase += p.swayFreq * dt;
      const sway = Math.sin(p.swayPhase) * p.swayAmp;
      const swayVel = Math.cos(p.swayPhase) * p.swayAmp * p.swayFreq;

      p.x += (p.vx + wind + swayVel * 0.35) * dt * 0.06;
      p.y += p.vy * dt * 0.06;

      // Rotación que sigue el balanceo — efecto de voltereta
      p.rot += (p.rotVel + swayVel * 0.012) * dt * 0.06;
      p.flip += p.flipSpeed * dt * 0.06;

      // Respawn arriba
      if (p.y > canvas.height + 60) {
        Object.assign(p, createPetal(canvas.width, canvas.height, false));
      }
      if (p.x < -40) p.x = canvas.width + 30;
      if (p.x > canvas.width + 40) p.x = -30;
    };

    const draw = (time: number) => {
      const dt = lastTime ? Math.min(time - lastTime, 32) : 16;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lejanos primero, cercanos después
      const sorted = [...petals].sort((a, b) => a.depth - b.depth);
      sorted.forEach(p => {
        updatePetal(p, dt);
        drawRealisticPetal(ctx, p);
      });

      animId = requestAnimationFrame(draw);
    };

    init();
    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <section className="flex flex-col items-center justify-center relative w-full h-full text-center overflow-hidden bg-[#030305] px-4">

      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,120,140,0.08) 0%, transparent 55%)" }}
      />

      <motion.div
        className="absolute pointer-events-none z-1"
        style={{ width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,80,80,0.12) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {LOVE_WHISPERS.map((word, i) => (
        <motion.span
          key={word}
          className="absolute pointer-events-none select-none font-serif-display italic text-rose-300/30 text-xs md:text-sm z-2"
          style={{ left: `${8 + (i % 3) * 38}%`, top: `${18 + Math.floor(i / 3) * 28}%` }}
          animate={{ y: [0, -14, 0], opacity: [0.2, 0.55, 0.2] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.7 }}
        >
          {word}
        </motion.span>
      ))}

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center z-10 w-full max-w-lg"
          >
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-[10px] tracking-[0.5em] uppercase text-rose-400/55 mb-3"
            >
              hecho con amor para ti
            </motion.p>

            <h1 className="font-serif-display font-light tracking-widest leading-none text-rose-300 text-6xl md:text-[8rem] drop-shadow-[0_0_25px_rgba(255,160,160,0.45)] mb-3">
              <Typewriter text="Casly" delay={0.5} speed={250} />
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
              className="font-serif-display italic text-rose-300/75 text-base md:text-lg tracking-wide mb-2"
            >
              mi lugar favorito en el mundo
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.6, duration: 1 }}
              className="text-[10px] tracking-[0.4em] uppercase font-light text-white/40 mb-10"
            >
              Conociéndonos y sumando...
            </motion.p>

            <motion.button
              onClick={() => { onPlayMusic(); onNext(); }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5, duration: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden rounded-full group bg-black/20 backdrop-blur-md"
            >
              <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-transparent transition-colors duration-300" />
              <div className="absolute -inset-full bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(255,160,160,0.8)_50%,transparent_100%)] animate-[spin_3s_linear_infinite] opacity-0 group-hover:opacity-100" />
              <div className="absolute inset-px bg-[#050508] rounded-full" />
              <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              <span className="relative z-10 block px-14 py-4 text-xs md:text-sm tracking-[0.3em] uppercase text-white/80 group-hover:text-white transition-all">
                Entrar
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
