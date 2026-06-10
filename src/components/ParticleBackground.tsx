import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  originalX: number;
  originalY: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000, radius: 140 };

    const resizeCanvas = () => {
      if (!canvas) return;
      const newWidth = canvas.parentElement?.clientWidth || window.innerWidth;
      const newHeight = canvas.parentElement?.clientHeight || window.innerHeight;
      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        initParticles();
      }
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(
        Math.floor((canvas.width * canvas.height) / 8000),
        100
      );

      const colors = [
        "rgba(242, 125, 38, 0.4)",  // Sophisticated Orange
        "rgba(251, 146, 60, 0.35)", // Soft Gold / Sand
        "rgba(224, 242, 254, 0.25)", // Ambient Pale Blue / White
        "rgba(120, 113, 108, 0.3)",  // Muted Stone
      ];

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = (Math.random() - 0.5) * 0.5;
        const speedY = (Math.random() - 0.5) * 0.5;
        const size = Math.random() * 3.5 + 1.5;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particles.push({
          x,
          y,
          size,
          speedX,
          speedY,
          color,
          originalX: x,
          originalY: y,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle connectors
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        // Update physics
        p1.x += p1.speedX;
        p1.y += p1.speedY;

        // Bounce on borders
        if (p1.x < 0 || p1.x > canvas.width) p1.speedX *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.speedY *= -1;

        // Mouse interaction (gravity push/pull)
        const dx = mouse.x - p1.x;
        const dy = mouse.y - p1.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Push particles away mildly
          p1.x -= Math.cos(angle) * force * 1.5;
          p1.y -= Math.sin(angle) * force * 1.5;
        }

        // Render point
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();
        
        // Removed the connector line logic as requested.
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    // Observers
    let resizeFrameId: number;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrameId);
      resizeFrameId = requestAnimationFrame(() => resizeCanvas());
    });
    canvas.parentElement && resizeObserver.observe(canvas.parentElement);

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    resizeCanvas();
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      cancelAnimationFrame(resizeFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      id="particles-ambient"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
    />
  );
}
