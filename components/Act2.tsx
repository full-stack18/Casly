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
    let mouse = { x: -9999, y: -9999 };

    function init() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 800 }, () => ({
        ox: Math.random() * canvas.width, 
        oy: Math.random() * canvas.height,
        x: Math.random() * canvas.width, 
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.2, 
        alpha: Math.random(), 
        velocity: Math.random() * 0.03 + 0.01,
        // Agregamos una probabilidad de que la estrella sea muy brillante
        isBright: Math.random() > 0.95
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        s.alpha += s.velocity;
        if (s.alpha <= 0.1 || s.alpha >= 1) s.velocity *= -1;
        
        const dx = mouse.x - s.x; const dy = mouse.y - s.y;
        const dist = Math.hypot(dx, dy);
        
        // Interacción mágica con el cursor
        if (dist < 150) {
          const force = (150 - dist) / 150;
          ctx.beginPath();
          // Halo de luz alrededor de la estrella al pasar el cursor
          ctx.arc(s.x, s.y, s.r + (force * 5), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 200, 220, ${force})`;
          ctx.fill();
        } else {
          s.x += (s.ox - s.x) * 0.05; 
          s.y += (s.oy - s.y) * 0.05;
        }

        // Dibujar estrella base con destellos aleatorios intensos
        ctx.beginPath(); 
        ctx.arc(s.x, s.y, s.isBright ? s.r * 1.5 : s.r, 0, Math.PI * 2);
        
        // Parpadeo intenso: si es una estrella "brillante" y su alpha está alto, resplandece
        if (s.isBright && s.alpha > 0.8) {
          ctx.fillStyle = `rgba(255, 255, 255, 1)`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.alpha)})`;
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    const handleMove = (e: any) => { mouse.x = e.touches ? e.touches[0].clientX : e.clientX; mouse.y = e.touches ? e.touches[0].clientY : e.clientY; };
    window.addEventListener("mousemove", handleMove); window.addEventListener("touchmove", handleMove); window.addEventListener("resize", init);
    init(); draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", init); window.removeEventListener("mousemove", handleMove); window.removeEventListener("touchmove", handleMove); clearTimeout(timer); };
  }, []);

  return (
    <section className="relative w-full h-full overflow-hidden cursor-crosshair bg-black" style={{ backgroundImage: "url('/universo.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      <div className="absolute top-[15%] w-full text-center z-10 pointer-events-none">
        <motion.p initial={{ opacity: 0, letterSpacing: "0.1em" }} animate={{ opacity: 1, letterSpacing: "0.5em" }} transition={{ duration: 3, ease: "easeOut" }} className="text-sm md:text-lg uppercase text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] font-light">
          Pide un deseo...
        </motion.p>
      </div>

      <AnimatePresence>
        {showButton && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-16 w-full flex justify-center z-20">
            <button onClick={onNext} className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-3 tracking-[0.2em] text-sm uppercase hover:bg-white hover:text-black transition-all rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Continuar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}