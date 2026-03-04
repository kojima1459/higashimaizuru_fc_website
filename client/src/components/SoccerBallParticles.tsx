import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  pattern: 'pentagon' | 'hexagon' | 'dot';
}

export const SoccerBallParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D | null;
    if (!ctx) return;

    // キャンバスサイズを設定
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // パーティクルの初期化
    const initializeParticles = () => {
      particlesRef.current = [];
      // パフォーマンス最適化：画面サイズに応じてパーティクル数を調整
      const particleCount = Math.max(10, Math.min(50, Math.floor(window.innerWidth / 150)));

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 30 + 10,
          opacity: Math.random() * 0.3 + 0.1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          pattern: ['pentagon', 'hexagon', 'dot'][Math.floor(Math.random() * 3)] as 'pentagon' | 'hexagon' | 'dot',
        });
      }
    };

    initializeParticles();

    // サッカーボール五角形パターンを描画
    const drawPentagon = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // 外側の五角形（黒）
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // 内側の装飾（白い枠線）
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    // 六角形パターンを描画
    const drawHexagon = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI) / 6;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    // ドット（円）を描画
    const drawDot = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string
    ) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // アニメーションループ
    const animate = () => {
      // 背景をクリア（半透明で残像効果）
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // パーティクルを更新・描画
      particlesRef.current.forEach((particle) => {
        // 位置を更新
        particle.x += particle.vx * 0.8; // 速度を少し落とす
        particle.y += particle.vy * 0.8;
        particle.rotation += particle.rotationSpeed;

        // 画面端での反射
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // 色を決定（青系グラデーション）
        const hue = Math.round(210 + Math.sin(particle.rotation) * 20);
        const saturation = Math.round(60 + Math.cos(particle.rotation) * 20);
        const lightness = Math.round(50 + Math.sin(particle.rotation * 0.5) * 10);
        const color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${particle.opacity.toFixed(2)})`;

        // パーティクルを描画
        ctx.globalAlpha = particle.opacity;
        if (particle.pattern === 'pentagon') {
          drawPentagon(ctx, particle.x, particle.y, particle.size, particle.rotation, color);
        } else if (particle.pattern === 'hexagon') {
          drawHexagon(ctx, particle.x, particle.y, particle.size, particle.rotation, color);
        } else {
          drawDot(ctx, particle.x, particle.y, particle.size, color);
        }
        ctx.globalAlpha = 1;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
};
