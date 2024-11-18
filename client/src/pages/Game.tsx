import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const BOAT_SIZE = 20;
const BOAT_SPEED = 3;
const WATER_COLOR = "#4A90E2";

interface GameState {
  x: number;
  y: number;
  dx: number;
  dy: number;
  score: number;
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    x: 100,
    y: 100,
    dx: 0,
    dy: 0,
    score: 0
  });

  const keys = useRef(new Set<string>());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight * 0.8;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Game loop
    let animationId: number;
    const gameLoop = () => {
      // Update position based on input
      let dx = gameState.dx;
      let dy = gameState.dy;

      if (keys.current.has('ArrowLeft')) dx = -BOAT_SPEED;
      if (keys.current.has('ArrowRight')) dx = BOAT_SPEED;
      if (keys.current.has('ArrowUp')) dy = -BOAT_SPEED;
      if (keys.current.has('ArrowDown')) dy = BOAT_SPEED;

      // Apply physics (simple momentum)
      const friction = 0.95;
      dx *= friction;
      dy *= friction;

      // Update position
      let newX = gameState.x + dx;
      let newY = gameState.y + dy;

      // Keep boat within canvas bounds
      newX = Math.max(BOAT_SIZE, Math.min(canvas.width - BOAT_SIZE, newX));
      newY = Math.max(BOAT_SIZE, Math.min(canvas.height - BOAT_SIZE, newY));

      // Clear canvas
      ctx.fillStyle = WATER_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw boat (simple triangle for now)
      ctx.save();
      ctx.translate(newX, newY);
      ctx.rotate(Math.atan2(dy, dx));
      ctx.beginPath();
      ctx.moveTo(BOAT_SIZE, 0);
      ctx.lineTo(-BOAT_SIZE, BOAT_SIZE/2);
      ctx.lineTo(-BOAT_SIZE, -BOAT_SIZE/2);
      ctx.closePath();
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.restore();

      // Update game state
      setGameState(prev => ({
        ...prev,
        x: newX,
        y: newY,
        dx,
        dy
      }));

      // Continue game loop
      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="min-h-screen p-8 pt-20 bg-gradient-to-br from-blue-400 to-blue-600">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-white mb-8">SJTU Cruiser 🚢</h1>
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="bg-blue-300 rounded-lg shadow-xl"
          />
        </div>
        <div className="text-white text-xl mt-4">
          Score: {gameState.score}
        </div>
      </motion.div>
    </div>
  );
}
