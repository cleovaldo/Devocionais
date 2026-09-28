import React, { useEffect, useRef } from 'react';
import { devotionalAudio } from '../services/audioEngine';

interface WaveformVisualizerProps {
  isPlaying: boolean;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const freqData = devotionalAudio.getWaveformData();
      const barCount = 28;
      const barWidth = 3;
      const gap = (width - barCount * barWidth) / (barCount - 1);

      for (let i = 0; i < barCount; i++) {
        let value = isPlaying ? freqData[i % freqData.length] / 255 : 0.08;
        if (!isPlaying) {
          // Subtle idle wave
          value = 0.08 + 0.04 * Math.sin(Date.now() / 300 + i * 0.3);
        } else {
          // Amplify response for visual impact
          value = Math.max(0.12, Math.min(0.95, value * 1.4));
        }

        const barHeight = Math.max(3, value * height * 0.85);
        const x = i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying) {
          gradient.addColorStop(0, '#ffd79d');
          gradient.addColorStop(0.5, '#60a5fa');
          gradient.addColorStop(1, '#3b82f6');
        } else {
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={180}
      height={32}
      className="w-full max-w-[180px] h-8 opacity-90"
    />
  );
};
