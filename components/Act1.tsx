"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "./Typewriter";

const LOVE_WHISPERS = ["te amo", "mi todo", "para ti", "mi princesa", "contigo", "siempre"];

// ─── Perlin noise mejorado para viento muy suave ─────────────────────────────
function smoothNoise(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  const a = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  const b = Math.sin((i + 1) * 127.1 + 311.7) * 43758.5453;
  return (a - Math.floor(a)) * (1 - u) + (b - Math.floor(b)) * u;
}

type Petal = {
  x: number; y: number;
  vx: number; vy: number;
  ax: number; ay: number;
  swingPhase: number;
  swingAmp: number;
  swingSpeed: number;
  rot: number;
  rotSpeed: number;
  rotAccel: number;
  wobble: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  scale: number;
  depth: number;
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
  // Forma
  shapeW: number;
  shapeTop: number;
  shapeBot: number;
  notchDepth: number;
  notchWidth: number;
  // Variaciones orgánicas en los puntos de control
  topIndent: number;       // cuanto se hunde la punta superior
  asymmetry: number;       // desplazamiento lateral del centro
  lobeFullness: number;    // redondez de los lóbulos laterales
  // Detalles de venas
  veinDetail: number;
  tornEdge: boolean;
  // Aleteo rápido (flutter)
  flutterAmp: number;
  flutterSpeed: number;
  flutterPhase: number;
};

// ─── Dibuja un pétalo ultra realista (más suave y detallado) ────────────────
function drawPetal(ctx: CanvasRenderingContext2D, p: Petal, time: number) {
  const depthScale = 0.4 + p.depth * 0.7;
  const s = p.scale * depthScale;

  // El coseno del wobble nos sirve para ver si el pétalo está “de frente” o “de espaldas”
  const wobbleCos = Math.cos(p.wobble);
  const isFront = wobbleCos >= 0;

  // Escala horizontal se reduce cuando está de perfil
  const scaleX = s * (0.25 + 0.75 * Math.abs(wobbleCos));
  const scaleY = s;
  if (scaleX < 0.2) return;

  ctx.save();
  // Transparencia: más opaco cuando está de frente, y los pétalos lejanos algo más transparentes
  const visibility = 0.6 + 0.4 * Math.abs(wobbleCos);
  ctx.globalAlpha = p.alpha * visibility * (0.6 + p.depth * 0.4);
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.scale(scaleX, scaleY);

  const hw = p.shapeW;
  const ht = p.shapeTop;
  const hb = p.shapeBot;
  const nd = p.notchDepth;
  const ti = p.topIndent;      // indentación en la punta (0 a 2)
  const asym = p.asymmetry;    // desplazamiento del eje central (-1 a 1)
  const lobe = p.lobeFullness; // 0.8 a 1.2

  // ── Construimos la forma del pétalo con una indentación superior ──
  ctx.beginPath();
  // Empezamos en el centro superior (ligeramente hendido)
  ctx.moveTo(asym * 0.7, -ht + ti * 0.8);

  // Lóbulo derecho (parte de arriba)
  ctx.bezierCurveTo(
    hw * 0.7 * lobe + asym * 0.5, -ht * 0.7 + ti * 0.5,
    hw * 0.95 * lobe + asym * 0.3, -ht * 0.15,
    hw * lobe + asym * 0.2, hb * 0.3
  );
  // Bajada por el lateral derecho
  ctx.bezierCurveTo(
    hw * 0.85 * lobe + asym * 0.1, hb * 0.75,
    hw * 0.5 * lobe - asym * 0.1, hb * 1.1,
    hw * 0.2 * lobe - asym * 0.2, hb + nd * 0.85
  );
  // Hendidura central inferior (base)
  ctx.quadraticCurveTo(
    asym * 0.3, hb + nd,
    -hw * 0.2 * lobe - asym * 0.2, hb + nd * 0.85
  );
  // Subida por el lateral izquierdo
  ctx.bezierCurveTo(
    -hw * 0.5 * lobe - asym * 0.1, hb * 1.1,
    -hw * 0.85 * lobe - asym * 0.1, hb * 0.75,
    -hw * lobe + asym * 0.2, hb * 0.3
  );
  // Lóbulo izquierdo (parte de arriba)
  ctx.bezierCurveTo(
    -hw * 0.95 * lobe + asym * 0.3, -ht * 0.15,
    -hw * 0.7 * lobe + asym * 0.5, -ht * 0.7 + ti * 0.5,
    asym * 0.7, -ht + ti * 0.8
  );
  ctx.closePath();

  // ── Color según orientación ──
  const lBase = isFront ? p.lightness : p.lightness - 10;
  const sBase = isFront ? p.saturation : p.saturation - 8;

  // Gradiente principal (de arriba hacia abajo, más claro en la zona superior)
  const grad = ctx.createLinearGradient(-hw * 0.2, -ht * 0.8, hw * 0.2, hb * 0.8);
  grad.addColorStop(0, `hsla(${p.hue}, ${sBase + 10}%, ${lBase + 20}%, 0.97)`);
  grad.addColorStop(0.25, `hsla(${p.hue}, ${sBase + 16}%, ${lBase + 8}%, 0.92)`);
  grad.addColorStop(0.6, `hsla(${p.hue}, ${sBase + 8}%, ${lBase - 4}%, 0.83)`);
  grad.addColorStop(1, `hsla(${p.hue}, ${sBase}%, ${lBase - 18}%, 0.6)`);
  ctx.fillStyle = grad;

  // Sombra muy sutil solo en pétalos lejanos
  if (p.depth > 0.5) {
    ctx.shadowBlur = 3 + (1 - p.depth) * 4;
    ctx.shadowColor = "rgba(20, 5, 10, 0.3)";
    ctx.shadowOffsetY = 1;
  }
  ctx.fill();
  ctx.shadowBlur = 0;

  // ── Venas ramificadas (más realistas) ──
  const veinOpacity = isFront ? 0.4 : 0.2;
  // Vena central
  ctx.beginPath();
  ctx.moveTo(asym * 0.2, -ht + ti * 0.5);
  ctx.quadraticCurveTo(asym * 0.15 + hw * 0.05, hb * 0.3, asym * 0.1, hb + nd * 0.5);
  ctx.strokeStyle = `hsla(${p.hue}, 20%, ${lBase - 20}%, ${veinOpacity})`;
  ctx.lineWidth = 0.6;
  ctx.lineCap = "round";
  ctx.stroke();

  // Venas laterales ramificadas
  const numVeins = Math.floor(p.veinDetail * 4);
  for (let v = 1; v <= numVeins; v++) {
    const t = v / (numVeins + 1);
    const yPos = -ht + (ht + hb + nd) * t;
    const widthAtY = hw * (1 - t * 0.4) * lobe;
    for (const side of [-1, 1]) {
      const sign = side;
      const startX = sign * 0.8 + asym * 0.2;
      const midX = sign * widthAtY * 0.5;
      const endX = sign * widthAtY * 0.8;
      ctx.beginPath();
      ctx.moveTo(startX, yPos);
      ctx.quadraticCurveTo(midX, yPos + sign * 0.4, endX, yPos + (hb + nd) * 0.08 * sign);
      ctx.strokeStyle = `hsla(${p.hue}, 18%, ${lBase - 16}%, ${veinOpacity * 0.8})`;
      ctx.lineWidth = 0.25 + t * 0.18;
      ctx.stroke();

      // Pequeña ramificación en las venas más largas
      if (v % 2 === 0 && t > 0.3) {
        ctx.beginPath();
        ctx.moveTo(midX, yPos + sign * 0.3);
        ctx.quadraticCurveTo(midX + sign * widthAtY * 0.15, yPos + (hb + nd) * 0.06 * sign, endX - sign * 3, yPos + (hb + nd) * 0.06 * sign);
        ctx.strokeStyle = `hsla(${p.hue}, 15%, ${lBase - 12}%, ${veinOpacity * 0.5})`;
        ctx.lineWidth = 0.15;
        ctx.stroke();
      }
    }
  }

  // ── Brillo especular (más delicado y dependiente de la luz) ──
  const shineIntensity = 0.18 * Math.abs(wobbleCos) * (1 - p.depth * 0.2);
  const shineGrad = ctx.createRadialGradient(
    -hw * 0.15 + asym * 0.1, -ht * 0.4, 0,
    -hw * 0.1, -ht * 0.35, hw * 0.7
  );
  shineGrad.addColorStop(0, `hsla(${p.hue}, 12%, ${lBase + 30}%, ${shineIntensity * 0.6})`);
  shineGrad.addColorStop(1, "transparent");
  ctx.fillStyle = shineGrad;
  ctx.fill();

  // Borde ligeramente más oscuro para dar profundidad (solo si el pétalo es grande)
  if (p.scale > 0.8) {
    ctx.beginPath();
    // Repetimos la forma pero con un clip para pintar solo el borde
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = `hsla(${p.hue}, 18%, ${lBase - 15}%, 0.25)`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// ─── Crea un pétalo con parámetros más variados y realistas ────────────────
function createPetal(w: number, h: number, spawnAtTop = false): Petal {
  const depth = Math.random() * 0.8 + 0.2;
  return {
    x: Math.random() * w,
    y: spawnAtTop ? -20 - Math.random() * 80 : Math.random() * h * 1.1,
    vx: (Math.random() - 0.5) * 0.06,
    vy: 0,
    ax: 0,
    ay: 0,
    swingPhase: Math.random() * Math.PI * 2,
    swingAmp: 0.3 + Math.random() * 0.7,
    swingSpeed: 0.002 + Math.random() * 0.005,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.002,
    rotAccel: (Math.random() - 0.5) * 0.0002,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.005 + Math.random() * 0.007,
    wobbleAmp: 0.5 + Math.random() * 0.6,
    shapeW: 6 + Math.random() * 4,
    shapeTop: 9 + Math.random() * 4,
    shapeBot: 7 + Math.random() * 3,
    notchDepth: 1.2 + Math.random() * 1.8,
    notchWidth: 0.8 + Math.random() * 1,
    topIndent: 0.5 + Math.random() * 2,
    asymmetry: (Math.random() - 0.5) * 1.5,
    lobeFullness: 0.85 + Math.random() * 0.35,
    veinDetail: 0.6 + Math.random() * 0.8,
    tornEdge: Math.random() > 0.8,
    flutterAmp: 0.01 + Math.random() * 0.03,
    flutterSpeed: 0.08 + Math.random() * 0.12,
    flutterPhase: Math.random() * Math.PI * 2,
    scale: 0.65 + Math.random() * 0.55,
    depth,
    hue: 332 + Math.random() * 18,
    saturation: 48 + Math.random() * 18,
    lightness: 53 + Math.random() * 14,
    alpha: 0.75 + Math.random() * 0.25,
  };
}

export default function Act1({
  onNext,
  onPlayMusic,
  isPlaying,
}: {
  onNext: () => void;
  onPlayMusic: () => void;
  isPlaying: boolean;
}) {
  const [show, setShow] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);

  useEffect(() => { setShow(true); }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let petals: Petal[] = [];
    let animId = 0;
    let lastTimestamp = 0;
    let windTime = 0;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      petals = Array.from({ length: 55 }, () =>
        createPetal(canvas.width, canvas.height, Math.random() > 0.6)
      );
    };

    const updatePetal = (p: Petal, dt: number, wind: number, turbulence: number) => {
      // Sub-pasos para una integración más precisa y fluida
      const substeps = 3;
      const subDt = dt / substeps;

      for (let s = 0; s < substeps; s++) {
        const dtNorm = Math.min(subDt, 16) / 16;

        // Gravedad muy baja para caída lenta y flotante
        const gravity = 0.04 + p.scale * 0.015;
        p.ay = gravity;

        // Resistencia del aire
        const airResistX = 0.998 - p.depth * 0.001;
        const airResistY = 0.997 - p.depth * 0.002;

        // Viento suave con turbulencia (más capas de ruido)
        const windForce = wind * (0.3 + p.depth * 0.25);
        const turbForce = turbulence * (0.25 - p.depth * 0.15) * Math.sin(timeRef.current * 0.5 + p.x * 0.01);

        p.ax = (windForce + turbForce - p.vx * 0.005) * dtNorm;

        // Velocidad terminal muy baja (máx. 1.0) para que caigan lento
        const terminalVel = 0.8 + p.scale * 0.3;
        if (Math.abs(p.vy) < terminalVel) {
          p.ay += (gravity * 0.04 - p.vy * 0.001) * dtNorm;
        }

        // Aleteo rápido (flutter) añadido a la velocidad de rotación
        p.flutterPhase += p.flutterSpeed * dtNorm;
        const flutterRot = Math.sin(p.flutterPhase) * p.flutterAmp;

        p.vx += p.ax;
        p.vy += p.ay * dtNorm;
        p.vx *= airResistX;
        p.vy *= airResistY;

        // Swing lateral (movimiento pendular suave)
        p.swingPhase += p.swingSpeed * dtNorm;
        const swingVel = Math.sin(p.swingPhase) * p.swingAmp * p.swingSpeed * 4;
        p.vx += swingVel * dtNorm * 0.18;

        // Actualizar posición
        p.x += p.vx * dtNorm;
        p.y += p.vy * dtNorm;

        // Rotación con inercia + flutter
        p.rotSpeed += (p.rotAccel + flutterRot) * dtNorm;
        p.rotSpeed = Math.max(-0.004, Math.min(0.004, p.rotSpeed));
        p.rot += p.rotSpeed * dtNorm;

        // Wobble lento (oscilación de la escala horizontal)
        p.wobble += p.wobbleSpeed * dtNorm;
      }

      // Reaparición suave cuando salen de la pantalla
      if (p.y > canvas.height + 120) {
        Object.assign(p, createPetal(canvas.width, canvas.height, true));
        p.y = -30 - Math.random() * 60;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -150) p.x = canvas.width + 100;
      if (p.x > canvas.width + 150) p.x = -100;
    };

    const draw = (timestamp: number) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
        requestAnimationFrame(draw);
        return;
      }

      let dt = Math.min(timestamp - lastTimestamp, 50);
      if (dt < 6) {
        requestAnimationFrame(draw);
        return;
      }
      lastTimestamp = timestamp;
      timeRef.current += dt * 0.001;
      windTime += dt * 0.001;

      // Viento más complejo: combinamos dos octavas de ruido suave y una onda sinusoidal
      const windBase = (smoothNoise(windTime * 0.07) - 0.5) * 0.25;
      const windGust = (smoothNoise(windTime * 0.15 + 10) - 0.5) * 0.1;
      const wind = windBase + windGust + Math.sin(windTime * 0.12) * 0.04;
      const turbulence = Math.sin(windTime * 0.35) * 0.07 + Math.cos(windTime * 0.22) * 0.05;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fondo con gradiente profundo y romántico
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, "#0a0507");
      bgGrad.addColorStop(0.5, "#0c0709");
      bgGrad.addColorStop(1, "#050304");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar pétalos ordenados por profundidad (más lejos primero)
      const sorted = [...petals].sort((a, b) => a.depth - b.depth);
      for (const p of sorted) {
        updatePetal(p, dt, wind, turbulence);
        drawPetal(ctx, p, timeRef.current);
      }

      animId = requestAnimationFrame(draw);
    };

    init();
    animId = requestAnimationFrame(draw);

    const handleResize = () => init();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="flex flex-col items-center justify-center relative w-full h-full text-center overflow-hidden bg-[#030305] px-4">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Glow ambiental tenue */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(ellipse at 50% 45%, rgba(255,100,120,0.05) 0%, transparent 65%)",
        }}
      />

      <motion.div
        className="absolute pointer-events-none z-[1]"
        style={{
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,70,80,0.08) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {LOVE_WHISPERS.map((word, i) => (
        <motion.span
          key={word}
          className="absolute pointer-events-none select-none font-serif-display italic text-rose-300/20 text-xs md:text-sm z-[2]"
          style={{
            left: `${5 + (i % 4) * 28}%`,
            top: `${12 + Math.floor(i / 3) * 22}%`,
          }}
          animate={{ y: [0, -10, 0], opacity: [0.12, 0.35, 0.12] }}
          transition={{ duration: 5 + i * 0.4, repeat: Infinity, delay: i * 0.6 }}
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
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-[10px] tracking-[0.5em] uppercase text-rose-400/45 mb-3"
            >
              hecho con amor para ti
            </motion.p>

            <h1 className="font-serif-display font-light tracking-widest leading-none text-rose-300 text-6xl md:text-[8rem] drop-shadow-[0_0_30px_rgba(255,130,130,0.4)] mb-3">
              <Typewriter text="Casly" delay={0.5} speed={250} />
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
              className="font-serif-display italic text-rose-300/65 text-base md:text-lg tracking-wide mb-2"
            >
              mi lugar favorito en el mundo
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.6, duration: 1 }}
              className="text-[10px] tracking-[0.4em] uppercase font-light text-white/30 mb-10"
            >
              Conociéndonos y sumando...
            </motion.p>

            <motion.button
              onClick={() => {
                onPlayMusic();
                onNext();
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5, duration: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden rounded-full group bg-black/20 backdrop-blur-md"
            >
              <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-transparent transition-colors duration-300" />
              <div className="absolute -inset-full bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(255,140,140,0.6)_50%,transparent_100%)] animate-[spin_3s_linear_infinite] opacity-0 group-hover:opacity-100" />
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