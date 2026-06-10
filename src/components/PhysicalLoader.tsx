import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Play, SkipForward } from "lucide-react";

interface PhysicalLoaderProps {
  onComplete: () => void;
}

export default function PhysicalLoader({ onComplete }: PhysicalLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing visual engine...");
  const [isSkipped, setIsSkipped] = useState(false);

  // Status text progression to make it feel deeply interactive and technical
  useEffect(() => {
    const statuses = [
      "Initializing visual engine...",
      "Configuring physical constants (g = 9.81)...",
      "Calibrating squash-and-stretch coefficients...",
      "Generating environment boundaries...",
      "Optimizing render buffers...",
      "Ready to launch portfolio!"
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1.2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (!isSkipped) {
              onComplete();
            }
          }, 400);
          return 100;
        }
        
        // Update status text based on progress brackets
        const index = Math.min(Math.floor((next / 100) * statuses.length), statuses.length - 1);
        setStatusText(statuses[index]);
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete, isSkipped]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    
    // Physics Ball Properties
    const ball = {
      x: 0,
      y: 0,
      radius: 20,
      vx: 0,
      vy: 0,
      gravity: 0.45,
      bounce: -0.75, // Energy retention on rebound
      friction: 0.98,
      mass: 1,
      
      // Squash & Stretch state
      scaleX: 1,
      scaleY: 1,
      targetScaleX: 1,
      targetScaleY: 1,
      squashVelocityX: 0,
      squashVelocityY: 0,
      squashTension: 0.15,
      squashDamping: 0.75,
    };

    // User interaction state
    const mouse = {
      x: 0,
      y: 0,
      isDown: false,
      isDragging: false,
      lastX: 0,
      lastY: 0
    };

    const safeNum = (val: number, fallback: number = 0): number => {
      return (typeof val === "number" && isFinite(val) && !isNaN(val)) ? val : fallback;
    };

    const getSafeRect = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0 || !isFinite(rect.width) || !isFinite(rect.height)) {
        return { width: 500, height: 400 };
      }
      return rect;
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = getSafeRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);

      // Center ball on resize if it's new
      if (ball.x === 0 && ball.y === 0) {
        ball.x = rect.width / 2;
        ball.y = rect.height / 3;
        ball.vy = -5; // give it an initial dynamic bounce!
        ball.vx = (Math.random() - 0.5) * 4;
      }
    };

    // Setup dimensions
    const initialRect = getSafeRect();
    ball.x = initialRect.width / 2;
    ball.y = initialRect.height / 3;
    ball.vy = -3;
    ball.vx = (Math.random() - 0.5) * 4;
    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    // Physical loop
    const updatePhysics = () => {
      const rect = getSafeRect();
      const width = rect.width;
      const height = rect.height;
      const floorY = height - 60; // Leave space for a gorgeous ground shadow

      if (mouse.isDragging) {
        // Track mouse position with physics drag
        ball.vx = (mouse.x - ball.x) * 0.22;
        ball.vy = (mouse.y - ball.y) * 0.22;
        ball.x = mouse.x;
        ball.y = mouse.y;

        // Visual stretching during drag based on actual speed
        const speed = Math.hypot(ball.vx, ball.vy);
        if (speed > 0.5) {
          const stretch = Math.min(speed * 0.035, 0.4);
          ball.targetScaleY = 1 + stretch;
          ball.targetScaleX = 1 - stretch * 0.5; // conserve area/volume
        } else {
          ball.targetScaleX = 1;
          ball.targetScaleY = 1;
        }
      } else {
        // Standard gravity integration
        ball.vy += ball.gravity;
        
        // Air resistance
        ball.vx *= ball.friction;

        ball.x += ball.vx;
        ball.y += ball.vy;

        const speed = Math.hypot(ball.vx, ball.vy);

        // 1. Squash & Stretch based on freefall velocity
        if (ball.y < floorY - ball.radius) {
          // In mid-air: stretch along the velocity direction
          if (speed > 1) {
            const stretchAmount = Math.min(speed * 0.015, 0.35);
            // Dynamic stretch aligned with movement path
            ball.targetScaleY = 1 + stretchAmount;
            ball.targetScaleX = 1 - stretchAmount * 0.4;
          } else {
            ball.targetScaleX = 1;
            ball.targetScaleY = 1;
          }
        }

        // 2. Bound checks and realistic squash/bounce on FLOOR
        if (ball.y + ball.radius >= floorY) {
          ball.y = floorY - ball.radius;
          
          // Impact squash calculation proportional to impact speed
          const impactSpeed = Math.abs(ball.vy);
          if (impactSpeed > 1) {
            const squash = Math.min(impactSpeed * 0.08, 0.55);
            ball.scaleY = 1 - squash; // Instant maximum squash on impact
            ball.scaleX = 1 + squash * 0.6;
          }
          
          ball.vy *= ball.bounce;
          
          // Re-apply random horizontal boost sometimes to prevent static settling
          if (Math.abs(ball.vy) < 1.0) {
            ball.vy = -4.5 - Math.random() * 3;
            ball.vx = (Math.random() - 0.5) * 6;
          }
        }

        // Left/Right boundaries walls bounce
        if (ball.x - ball.radius <= 10) {
          ball.x = 10 + ball.radius;
          ball.vx *= ball.bounce;
          
          const impactSpeed = Math.abs(ball.vx);
          if (impactSpeed > 1) {
            const squash = Math.min(impactSpeed * 0.08, 0.45);
            ball.scaleX = 1 - squash;
            ball.scaleY = 1 + squash * 0.5;
          }
        } else if (ball.x + ball.radius >= width - 10) {
          ball.x = width - 10 - ball.radius;
          ball.vx *= ball.bounce;

          const impactSpeed = Math.abs(ball.vx);
          if (impactSpeed > 1) {
            const squash = Math.min(impactSpeed * 0.08, 0.45);
            ball.scaleX = 1 - squash;
            ball.scaleY = 1 + squash * 0.5;
          }
        }

        // Ceiling bounce
        if (ball.y - ball.radius <= 10) {
          ball.y = 10 + ball.radius;
          ball.vy *= ball.bounce;
        }
      }

      // Spring physics on the squash/stretch parameters to breathe and overshoot like a cartoon lottie
      const ax = (ball.targetScaleX - ball.scaleX) * ball.squashTension;
      ball.squashVelocityX += ax;
      ball.squashVelocityX *= ball.squashDamping;
      ball.scaleX += ball.squashVelocityX;

      const ay = (ball.targetScaleY - ball.scaleY) * ball.squashTension;
      ball.squashVelocityY += ay;
      ball.squashVelocityY *= ball.squashDamping;
      ball.scaleY += ball.squashVelocityY;

      // Sanitize all ball parameters to protect against NaN / Infinity
      ball.x = safeNum(ball.x, rect.width / 2);
      ball.y = safeNum(ball.y, rect.height / 3);
      ball.vx = safeNum(ball.vx, 0);
      ball.vy = safeNum(ball.vy, 0);
      ball.scaleX = Math.max(0.05, safeNum(ball.scaleX, 1));
      ball.scaleY = Math.max(0.05, safeNum(ball.scaleY, 1));
      ball.targetScaleX = Math.max(0.05, safeNum(ball.targetScaleX, 1));
      ball.targetScaleY = Math.max(0.05, safeNum(ball.targetScaleY, 1));
      ball.squashVelocityX = safeNum(ball.squashVelocityX, 0);
      ball.squashVelocityY = safeNum(ball.squashVelocityY, 0);
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rect = getSafeRect();
      const height = rect.height;
      const floorY = height - 60;

      updatePhysics();

      // Draw subtle physical floor border
      ctx.strokeStyle = "rgba(63, 63, 70, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(10, floorY + 4);
      ctx.lineTo(rect.width - 10, floorY + 4);
      ctx.stroke();

      // 1. Draw physical falling shadow
      // The shadow gets larger and darker as the ball gets closer to the floor
      const distanceFromFloor = Math.max(0, floorY - ball.y);
      const maxDistance = Math.max(1, height * 0.7);
      const ratio = Math.max(0, Math.min(1, 1 - distanceFromFloor / maxDistance)) || 0;
      
      const shadowWidth = Math.max(0.1, ball.radius * ball.scaleX * (1.2 + ratio * 1.5) || 0.1);
      const shadowHeight = 5 * ratio;
      const shadowOpacity = 0.4 * ratio;

      ctx.save();
      const shadowGrad = ctx.createRadialGradient(
        ball.x, floorY + 4, 1,
        ball.x, floorY + 4, shadowWidth
      );
      shadowGrad.addColorStop(0, `rgba(249, 115, 22, ${shadowOpacity})`);
      shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(ball.x, floorY + 4, shadowWidth, shadowHeight, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Draw physical indicator vector lines if clicked/dragged
      if (mouse.isDragging) {
        ctx.strokeStyle = "rgba(249, 115, 22, 0.2)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 3. Draw the interactive Ball with Physical Squeeze/Recoil
      ctx.save();
      ctx.translate(ball.x, ball.y);
      
      // Rotate ball slightly aligned with velocity vector
      const angle = Math.atan2(ball.vy, ball.vx);
      // We only rotate mid-air if velocity is high to give "leading action"
      const currentSpeed = Math.hypot(ball.vx, ball.vy);
      if (currentSpeed > 0.5 && !mouse.isDragging) {
        ctx.rotate(angle - Math.PI / 2);
      }
      
      // Radii according to physical squeeze multipliers
      const rx = Math.max(0.1, ball.radius * ball.scaleX || 0.1);
      const ry = Math.max(0.1, ball.radius * ball.scaleY || 0.1);

      // Draw aesthetic outer halo glow
      const ballGlow = ctx.createRadialGradient(0, 0, Math.max(0.1, ball.radius * 0.2), 0, 0, Math.max(0.1, ball.radius * 2.2));
      ballGlow.addColorStop(0, "rgba(249, 115, 22, 0.4)");
      ballGlow.addColorStop(0.3, "rgba(249, 115, 22, 0.15)");
      ballGlow.addColorStop(1, "rgba(249, 115, 22, 0)");
      ctx.fillStyle = ballGlow;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx * 2.2, ry * 2.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw shiny core gradient
      const ballGrad = ctx.createRadialGradient(
        (-ball.radius * 0.3 * ball.scaleX) || 0,
        (-ball.radius * 0.4 * ball.scaleY) || 0,
        1,
        0, 0, Math.max(0.1, ball.radius)
      );
      ballGrad.addColorStop(0, "#fffefe");
      ballGrad.addColorStop(0.2, "#ffb884");
      ballGrad.addColorStop(0.5, "#f97316"); // Brand Orange
      ballGrad.addColorStop(1, "#c2410c"); // Deep rust core boundary

      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();

      // Aesthetic specular highlights highlights
      ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
      ctx.beginPath();
      ctx.ellipse(
        -ball.radius * 0.35 * ball.scaleX,
        -ball.radius * 0.4 * ball.scaleY,
        rx * 0.25,
        ry * 0.25,
        0, 0, Math.PI * 2
      );
      ctx.fill();

      ctx.restore();

      // Draw brief interactive prompt
      ctx.fillStyle = "rgba(161, 161, 170, 0.35)";
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Interactive sandbox: Drag or click the physics ball!", rect.width / 2, height - 20);

      animFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse interactive events
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = safeNum(e.clientX - rect.left, ball.x);
      const clickY = safeNum(e.clientY - rect.top, ball.y);

      // Check distance to ball to see if user grabbed it!
      const dist = Math.hypot(clickX - ball.x, clickY - ball.y);
      if (dist <= ball.radius * 2.5) {
        mouse.isDragging = true;
        mouse.x = clickX;
        mouse.y = clickY;
      } else {
        // Apply immediate gravity-well warp impulse!
        ball.vx = (clickX - ball.x) * 0.15;
        ball.vy = (clickY - ball.y) * 0.15 - 5; // Launch it up
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = safeNum(e.clientX - rect.left, mouse.x);
      mouse.y = safeNum(e.clientY - rect.top, mouse.y);
    };

    const handleMouseUp = () => {
      mouse.isDragging = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Support touch devices as well for pristine mobile feel
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = safeNum(e.touches[0].clientX - rect.left, ball.x);
      const clickY = safeNum(e.touches[0].clientY - rect.top, ball.y);

      const dist = Math.hypot(clickX - ball.x, clickY - ball.y);
      if (dist <= ball.radius * 3.5) {
        mouse.isDragging = true;
        mouse.x = clickX;
        mouse.y = clickY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = safeNum(e.touches[0].clientX - rect.left, mouse.x);
      mouse.y = safeNum(e.touches[0].clientY - rect.top, mouse.y);
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  const handleSkip = () => {
    setIsSkipped(true);
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Background structural nodes */}
      <div className="absolute inset-0 bg-[radial-gradient(#1c1917_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange-600/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-500/5 blur-[120px]" />

      {/* Physics Canvas Sandbox container */}
      <div className="w-full max-w-[560px] flex flex-col items-center">
        
        {/* Decorative Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-950/20 border border-orange-500/20 rounded-full text-[10px] font-mono text-orange-400 font-bold tracking-wider uppercase mb-4"
        >
          <Sparkles className="w-3 h-3 animate-pulse text-orange-400" />
          <span>Interactive Physics Core</span>
        </motion.div>

        {/* Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-3xl font-display font-light text-white tracking-tight text-center italic serif"
        >
          Synthesizing <span className="not-italic text-orange-500 font-bold uppercase font-sans tracking-wide">Experiences</span>
        </motion.h2>

        {/* Physical Engine canvas border frame */}
        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative w-full aspect-[4/3] rounded-2xl bg-zinc-900/10 border border-zinc-900/80 mt-6 overflow-hidden flex items-center justify-center backdrop-blur-3xl p-1"
        >
          {/* Subtle inside visual grid lines */}
          <div className="absolute inset-0 bg-[#09090b]/40 z-0 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-14 border-t border-dashed border-zinc-900/60 z-0 pointer-events-none" />
          
          <canvas 
            id="physics-bounce-viewport"
            ref={canvasRef} 
            className="relative z-10 block cursor-grab active:cursor-grabbing" 
          />
        </motion.div>

        {/* Loading Progress details */}
        <div className="w-full mt-8 max-w-[420px]">
          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 tracking-wider font-medium">
            <span className="uppercase">{statusText}</span>
            <span className="text-orange-400 font-bold">{Math.round(progress)}%</span>
          </div>

          {/* Progress bar tracks */}
          <div className="h-1 bg-zinc-900 rounded-full overflow-hidden mt-2.5 border border-zinc-900/60">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Action Skip Pill */}
        <motion.button 
          onClick={handleSkip}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-4 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-full text-[10px] font-mono flex items-center gap-2 cursor-pointer transition-all uppercase tracking-widest font-bold"
        >
          <SkipForward className="w-3.5 h-3.5" />
          <span>Skip & Skip Launch</span>
        </motion.button>
      </div>
    </div>
  );
}
