import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  pulsePhase: number;
}

interface Pulse {
  sourceIndex: number;
  targetIndex: number;
  progress: number;
  speed: number;
  color: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  flickerSpeed: number;
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const NeuralBackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates
    const mouse = { x: -1000, y: -1000, radius: 160 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Background Stars
    const starCount = Math.floor((width * height) / 8000);
    const stars: Star[] = Array.from({ length: Math.min(220, starCount) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      flickerSpeed: 0.01 + Math.random() * 0.02,
    }));

    // Neural Network Nodes
    const nodeCount = Math.min(65, Math.max(35, Math.floor(width / 24)));
    const colors = ['#38bdf8', '#818cf8', '#a855f7', '#c084fc', '#22d3ee'];
    
    const nodes: Node[] = Array.from({ length: nodeCount }, () => {
      const baseRadius = Math.random() * 2.2 + 2;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: baseRadius,
        baseRadius,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulsePhase: Math.random() * Math.PI * 2,
      };
    });

    // Synaptic Pulses traveling along lines
    const pulses: Pulse[] = [];
    const maxPulses = 12;

    const spawnPulse = () => {
      if (pulses.length >= maxPulses) return;
      const src = Math.floor(Math.random() * nodes.length);
      // find a neighbor close enough
      const srcNode = nodes[src];
      const validTargets: number[] = [];
      for (let i = 0; i < nodes.length; i++) {
        if (i === src) continue;
        const dx = nodes[i].x - srcNode.x;
        const dy = nodes[i].y - srcNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          validTargets.push(i);
        }
      }
      if (validTargets.length > 0) {
        const tgt = validTargets[Math.floor(Math.random() * validTargets.length)];
        pulses.push({
          sourceIndex: src,
          targetIndex: tgt,
          progress: 0,
          speed: 0.012 + Math.random() * 0.016,
          color: Math.random() > 0.5 ? '#38bdf8' : '#c084fc',
        });
      }
    };

    let lastPulseSpawn = 0;

    // Render loop
    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle twinkling cosmic stars
      for (const s of stars) {
        s.alpha += Math.sin(time * s.flickerSpeed) * 0.005;
        const currentAlpha = Math.max(0.1, Math.min(0.85, s.alpha));
        ctx.fillStyle = `rgba(224, 231, 255, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Mouse Glow Aura
      if (mouse.x > 0 && mouse.y > 0) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, mouse.radius
        );
        mouseGlow.addColorStop(0, 'rgba(56, 189, 248, 0.09)');
        mouseGlow.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)');
        mouseGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Update & Draw Synaptic Connections
      const maxDistance = 160;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.35;
            
            // Check if mouse is near this connection
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            const mouseDist = Math.sqrt((mouse.x - midX) ** 2 + (mouse.y - midY) ** 2);
            const isMouseNear = mouseDist < mouse.radius;
            const finalAlpha = isMouseNear ? Math.min(0.8, alpha * 2.2) : alpha;

            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, `rgba(56, 189, 248, ${finalAlpha})`);
            grad.addColorStop(1, `rgba(168, 85, 247, ${finalAlpha})`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = isMouseNear ? 1.5 : 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // 4. Update and Draw Traveling Pulses
      if (time - lastPulseSpawn > 350) {
        spawnPulse();
        lastPulseSpawn = time;
      }

      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k];
        p.progress += p.speed;
        if (p.progress >= 1) {
          pulses.splice(k, 1);
          continue;
        }

        const src = nodes[p.sourceIndex];
        const tgt = nodes[p.targetIndex];
        if (!src || !tgt) continue;

        const currentX = src.x + (tgt.x - src.x) * p.progress;
        const currentY = src.y + (tgt.y - src.y) * p.progress;

        // Draw glowing pulse dot
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // 5. Update and Draw Nodes
      for (const node of nodes) {
        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Bounce at boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Mouse interaction: slight gravitation / repulsion
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let scale = 1;

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          node.x += (dx / dist) * force * 1.5;
          node.y += (dy / dist) * force * 1.5;
          scale = 1 + force * 0.8;
        }

        // Pulse size
        node.pulsePhase += 0.03;
        const pulsedRadius = (node.baseRadius + Math.sin(node.pulsePhase) * 0.6) * scale;

        // Outer glow
        const glow = ctx.createRadialGradient(
          node.x, node.y, pulsedRadius * 0.4,
          node.x, node.y, pulsedRadius * 3.5
        );
        glow.addColorStop(0, node.color);
        glow.addColorStop(0.35, hexToRgba(node.color, 0.35));
        glow.addColorStop(1, 'transparent');

        // Draw core node
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulsedRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ background: 'radial-gradient(ellipse at 50% 20%, #0d122b 0%, #050711 75%, #020307 100%)' }}
    />
  );
};
