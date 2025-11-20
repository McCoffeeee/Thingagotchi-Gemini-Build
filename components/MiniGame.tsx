import React, { useRef, useEffect, useState, useCallback } from 'react';

interface MiniGameProps {
  onGameOver: (score: number) => void;
  onExit: () => void;
}

// --- ASSETS ---

// 12x12 simplified Cat
const CAT_SPRITE = [
  [0,0,2,0,0,0,0,2,0,0,0,0],
  [0,0,2,2,0,0,0,2,2,0,0,0],
  [0,0,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,3,1,1,1,3,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,0,0,2],
  [0,0,1,1,1,1,1,1,1,2,2,2],
  [0,0,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,1,1,1,1,1,0,0,0,0], 
  [0,0,2,0,0,0,0,2,0,0,0,0], 
];

// 8x6 Bush
const BUSH_SPRITE = [
  [0,0,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,0],
  [1,1,1,2,2,1,1,1],
  [1,1,2,1,1,2,1,1],
  [1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,0],
];

// 8x8 Fence
const FENCE_SPRITE = [
  [0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
];

// 8x8 Bin
const BIN_SPRITE = [
  [0,1,1,1,1,1,1,0],
  [1,2,2,2,2,2,2,1],
  [1,2,0,0,0,0,2,1],
  [1,2,0,0,0,0,2,1],
  [1,2,0,0,0,0,2,1],
  [1,2,0,0,0,0,2,1],
  [1,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1],
];

// 10x5 Cloud
const CLOUD_SPRITE = [
    [0,0,0,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,0,0],
    [1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,0,0,1,1,0,0],
];

// Color Palettes
const PALETTES = {
  CAT: { 1: '#fbbf24', 2: '#b45309', 3: '#1e293b' },
  BUSH: { 1: '#65a30d', 2: '#3f6212' }, // Lime-600, Lime-800
  FENCE: { 1: '#92400e' }, // Amber-800
  BIN: { 1: '#475569', 2: '#94a3b8' }, // Slate-600, Slate-400
  CLOUD: { 1: '#ffffff' },
  GROUND: { 1: '#4ade80', 2: '#166534' } // Grass detail
};

type ObstacleType = 'BUSH' | 'FENCE' | 'BIN';

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: ObstacleType;
}

interface Cloud {
  x: number;
  y: number;
  speed: number;
}

interface GroundDetail {
  x: number;
  type: 1 | 2; // 1=light grass, 2=dark pebble
}

const MiniGame: React.FC<MiniGameProps> = ({ onGameOver, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const requestRef = useRef<number | null>(null);
  
  // Game Constants
  const GRAVITY = 0.6;
  const JUMP_FORCE = -12;
  const BASE_SPEED = 6;
  const GROUND_Y = 300;
  const SCALE = 4;
  
  // Game State
  const gameState = useRef({
    catY: GROUND_Y - (11 * SCALE),
    velocity: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    clouds: [] as Cloud[],
    groundDetails: [] as GroundDetail[],
    frameCount: 0,
    score: 0,
    active: true,
    speed: BASE_SPEED
  });

  const jump = useCallback(() => {
    if (!gameState.current.isJumping && gameState.current.active) {
      gameState.current.velocity = JUMP_FORCE;
      gameState.current.isJumping = true;
    }
  }, []);

  // Helper to draw any sprite matrix
  const drawPixelSprite = (
    ctx: CanvasRenderingContext2D, 
    sprite: number[][], 
    x: number, 
    y: number, 
    palette: Record<number, string>,
    scale: number = SCALE
  ) => {
    for (let row = 0; row < sprite.length; row++) {
      for (let col = 0; col < sprite[row].length; col++) {
        const pixel = sprite[row][col];
        if (pixel !== 0 && palette[pixel]) {
          ctx.fillStyle = palette[pixel];
          ctx.fillRect(
            x + col * scale,
            y + row * scale,
            scale,
            scale
          );
        }
      }
    }
  };

  useEffect(() => {
    const handleInput = (e: Event) => {
      if ((e.target as HTMLElement).tagName === 'BUTTON') return;
      e.preventDefault();
      jump();
    };
    
    window.addEventListener('keydown', handleInput);
    window.addEventListener('touchstart', handleInput, { passive: false });
    window.addEventListener('mousedown', handleInput);
    
    return () => {
      window.removeEventListener('keydown', handleInput);
      window.removeEventListener('touchstart', handleInput);
      window.removeEventListener('mousedown', handleInput);
    };
  }, [jump]);

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const state = gameState.current;
    if (!state.active) return;

    // --- UPDATE ---
    state.frameCount++;
    
    // Increase speed slightly over time
    if (state.frameCount % 500 === 0) {
        state.speed += 0.5;
    }

    // Physics
    state.velocity += GRAVITY;
    state.catY += state.velocity;

    const floorLimit = GROUND_Y - (11 * SCALE);
    if (state.catY > floorLimit) {
      state.catY = floorLimit;
      state.velocity = 0;
      state.isJumping = false;
    }

    // Spawn Clouds
    if (state.frameCount % 120 === 0) {
        state.clouds.push({
            x: canvas.width,
            y: Math.random() * 150 + 20, // Sky area
            speed: (Math.random() * 1 + 0.5) // Slower than ground
        });
    }

    // Spawn Ground Details
    if (state.frameCount % 15 === 0) {
        state.groundDetails.push({
            x: canvas.width,
            type: Math.random() > 0.5 ? 1 : 2
        });
    }

    // Spawn Obstacles
    if (state.frameCount % 90 === 0) { // Frequency
        if (Math.random() > 0.3) { // Chance
            const typeRand = Math.random();
            let type: ObstacleType = 'BUSH';
            let sprite = BUSH_SPRITE;
            
            if (typeRand > 0.66) {
                type = 'BIN';
                sprite = BIN_SPRITE;
            } else if (typeRand > 0.33) {
                type = 'FENCE';
                sprite = FENCE_SPRITE;
            }

            state.obstacles.push({
                x: canvas.width,
                y: GROUND_Y - (sprite.length * SCALE),
                width: sprite[0].length * SCALE,
                height: sprite.length * SCALE,
                type
            });
        }
    }

    // Move Entities
    state.clouds.forEach(c => c.x -= c.speed);
    state.groundDetails.forEach(g => g.x -= state.speed);
    state.obstacles.forEach(o => o.x -= state.speed);

    // Cleanup
    state.clouds = state.clouds.filter(c => c.x > -100);
    state.groundDetails = state.groundDetails.filter(g => g.x > -20);
    
    // Score & Cleanup Obstacles
    if (state.obstacles.length > 0 && state.obstacles[0].x < -50) {
      state.obstacles.shift();
      state.score += 10;
      setScore(state.score);
    }

    // Collision Detection
    const catHitbox = { 
        x: 50 + 8, // Padding
        y: state.catY + 8, 
        w: (12 * SCALE) - 16, 
        h: (11 * SCALE) - 16 
    };
    
    state.obstacles.forEach(obs => {
      const obsHitbox = {
          x: obs.x + 4,
          y: obs.y + 4,
          w: obs.width - 8,
          h: obs.height - 8
      };

      if (
        catHitbox.x < obsHitbox.x + obsHitbox.w &&
        catHitbox.x + catHitbox.w > obsHitbox.x &&
        catHitbox.y < obsHitbox.y + obsHitbox.h &&
        catHitbox.y + catHitbox.h > obsHitbox.y
      ) {
             state.active = false;
             setIsGameOver(true);
             onGameOver(state.score);
      }
    });

    // --- DRAW ---
    
    // Sky
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#1e1b4b"); // Indigo-950
    gradient.addColorStop(1, "#312e81"); // Indigo-900
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clouds
    ctx.globalAlpha = 0.5;
    state.clouds.forEach(cloud => {
        drawPixelSprite(ctx, CLOUD_SPRITE, cloud.x, cloud.y, PALETTES.CLOUD, SCALE);
    });
    ctx.globalAlpha = 1.0;

    // Ground Background
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
    
    // Ground Line
    ctx.strokeStyle = '#9bbc0f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(canvas.width, GROUND_Y);
    ctx.stroke();

    // Ground Details
    state.groundDetails.forEach(detail => {
        ctx.fillStyle = detail.type === 1 ? '#4ade80' : '#166534';
        ctx.fillRect(detail.x, GROUND_Y + 4, 4, 4);
    });

    // Obstacles
    state.obstacles.forEach(obs => {
      let sprite = BUSH_SPRITE;
      let palette: Record<number, string> = PALETTES.BUSH;
      
      if (obs.type === 'FENCE') { sprite = FENCE_SPRITE; palette = PALETTES.FENCE; }
      if (obs.type === 'BIN') { sprite = BIN_SPRITE; palette = PALETTES.BIN; }

      drawPixelSprite(ctx, sprite, obs.x, obs.y, palette, SCALE);
    });

    // Cat
    drawPixelSprite(ctx, CAT_SPRITE, 50, state.catY, PALETTES.CAT, SCALE);

    requestRef.current = requestAnimationFrame(loop);
  }, [onGameOver]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [loop]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-900">
      <div className="absolute top-4 left-4 text-white font-pixel text-xl z-10 bg-black/50 px-4 py-2 rounded border border-gray-600">
        Score: {score}
      </div>
      
      <canvas 
        ref={canvasRef}
        width={800} 
        height={400}
        className="w-full max-w-4xl h-auto border-4 border-gray-700 rounded-lg bg-[#1a1b26] shadow-2xl image-pixelated"
        style={{ imageRendering: 'pixelated' }}
      />

      {isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 backdrop-blur-sm transition-all">
          <div className="bg-gray-800 p-8 rounded-2xl border-4 border-red-500 text-center shadow-2xl transform scale-110">
            <h2 className="text-4xl font-bold text-red-500 mb-4 font-pixel animate-pulse">GAME OVER</h2>
            <p className="text-2xl text-white mb-8 font-pixel">Score: {score}</p>
            <button 
              onClick={onExit}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 font-pixel text-lg"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
      
      {!isGameOver && (
        <div className="absolute bottom-4 text-gray-500 text-sm animate-pulse font-pixel">
          [SPACE] or [TAP] to Jump
        </div>
      )}
    </div>
  );
};

export default MiniGame;