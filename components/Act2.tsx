// components/Act2.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Act2({ onNext }: { onNext: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Reducido a 4 segundos
    const timer = setTimeout(() => setShowButton(true), 4000);
    
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let stars: any[] = [];
    let meteors: any[] = [];
    let mouse = { x: -9999, y: -9999 };

    function init() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 500 }, () => ({
        ox: Math.random() * canvas.width, 
        oy: Math.random() * canvas.height,
        x: Math.random() * canvas.width, 
        y: Math.random() * canvas.height,
        originalR: Math.random() * 1.5,
        r: Math.random() * 1.5, 
        alpha: Math.random(), 
        velocity: Math.random() * 0.015
      }));
    }

    function createMeteor() {
      meteors.push({
        x: Math.random() * canvas.width * 1.5, y: -50,
        length: Math.random() * 80 + 20, speed: Math.random() * 15 + 10,
        angle: Math.PI / 4, opacity: 1
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Fondo transparente para que se vea la imagen CSS

      // Estrellas
      stars.forEach(s => {
        s.alpha += s.velocity;
        if (s.alpha <= 0 || s.alpha >= 1) s.velocity *= -1;
        
        // Interacción: Se apartan y brillan de color al pasar cerca
        const dx = mouse.x - s.x;
        const dy = mouse.y - s.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < 120) {
          const angle = Math.atan2(dy, dx);
          const force = (120 - dist) / 120;
          s.x -= Math.cos(angle) * force * 3;
          s.y -= Math.sin(angle) * force * 3;
          s.r = s.originalR + force * 2.5; 
          ctx.fillStyle = `rgba(255, 180, 200, ${Math.abs(s.alpha) + force})`; // Color rosado brillante
        } else {
          s.x += (s.ox - s.x) * 0.03; // Regresan a su posición
          s.y += (s.oy - s.y) * 0.03;
          s.r += (s.originalR - s.r) * 0.1;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.alpha)})`;
        }

        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });

      // Meteoros
      if (Math.random() < 0.01) createMeteor();
      for (let i = meteors.length - 1; i >= 0; i--) {
        let m = meteors[i];
        m.x -= Math.cos(m.angle) * m.speed; m.y += Math.sin(m.angle) * m.speed; m.opacity -= 0.02;
        ctx.beginPath(); ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x + Math.cos(m.angle) * m.length, m.y - Math.sin(m.angle) * m.length);
        ctx.strokeStyle = `rgba(255, 255, 255, ${m.opacity})`; ctx.lineWidth = 1.5; ctx.stroke();
        if (m.opacity <= 0) meteors.splice(i, 1);
      }

      animId = requestAnimationFrame(draw);
    }

    window.addEventListener("mousemove", e => { mouse = { x: e.clientX, y: e.clientY }; });
    window.addEventListener("touchmove", e => { mouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }; });
    window.addEventListener("resize", init);
    
    init(); draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", init); clearTimeout(timer); };
  }, []);

  return (
    <section 
      className="relative w-full h-full overflow-hidden cursor-crosshair bg-black"
      style={{ backgroundImage: "url('/universo.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-black/40" /> {/* Oscurece un poco la imagen de fondo */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      <div className="absolute top-16 left-0 w-full text-center z-10 pointer-events-none">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="text-xs md:text-sm tracking-[0.4em] uppercase text-white/70 drop-shadow-md">
          Atraviesa las estrellas
        </motion.p>
      </div>

      <AnimatePresence>
        {showButton && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-16 w-full flex justify-center z-20">
            <button onClick={onNext} className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-3 tracking-[0.2em] text-sm uppercase hover:bg-white/20 transition-all rounded-full shadow-lg">
              Continuar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}