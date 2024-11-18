import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const BOAT_SIZE = 20;
const BOAT_SPEED = 3;
const WATER_COLOR = "#4A90E2";

// Load map image
const MAP_IMAGE = new Image();
MAP_IMAGE.src = "/1125e4cf-c2cb-464a-af2d-c58fbb286e4a.jpg";

// Add error handling for image loading
MAP_IMAGE.onerror = () => {
  console.error('Failed to load map image');
};

interface GameState {
  x: number;
  y: number;
  dx: number;
  dy: number;
  score: number;
  isInWater: boolean;
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const collisionCanvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    x: 100,
    y: 100,
    dx: 0,
    dy: 0,
    score: 0,
    isInWater: true
  });

  const keys = useRef(new Set<string>());

  useEffect(() => {
    const canvas = canvasRef.current;
    const collisionCanvas = collisionCanvasRef.current;
    if (!canvas || !collisionCanvas) return;

    const ctx = canvas.getContext("2d");
    const collisionCtx = collisionCanvas.getContext("2d");
    if (!ctx || !collisionCtx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight * 0.8;
      collisionCanvas.width = canvas.width;
      collisionCanvas.height = canvas.height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize collision detection canvas
    const initCollisionCanvas = () => {
      collisionCtx.drawImage(MAP_IMAGE, 0, 0, collisionCanvas.width, collisionCanvas.height);
    };

    // Check if a point is in water
    const checkWaterCollision = (x: number, y: number): boolean => {
      const pixel = collisionCtx.getImageData(x, y, 1, 1).data;
      return pixel[2] > 150 && pixel[0] < 100; // Check for blue-ish colors
    };

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

      // Calculate new position
      let newX = gameState.x + dx;
      let newY = gameState.y + dy;

      // Keep boat within canvas bounds
      newX = Math.max(BOAT_SIZE, Math.min(canvas.width - BOAT_SIZE, newX));
      newY = Math.max(BOAT_SIZE, Math.min(canvas.height - BOAT_SIZE, newY));

      // Check water collision for new position
      const isInWater = checkWaterCollision(newX, newY);

      // Only update position if in water
      if (!isInWater) {
        // Bounce back
        newX = gameState.x - dx * 0.5;
        newY = gameState.y - dy * 0.5;
        dx = 0;
        dy = 0;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw map
      ctx.drawImage(MAP_IMAGE, 0, 0, canvas.width, canvas.height);

      // Draw boat (simple triangle)
      ctx.save();
      ctx.translate(newX, newY);
      ctx.rotate(Math.atan2(dy, dx));
      ctx.beginPath();
      ctx.moveTo(BOAT_SIZE, 0);
      ctx.lineTo(-BOAT_SIZE, BOAT_SIZE/2);
      ctx.lineTo(-BOAT_SIZE, -BOAT_SIZE/2);
      ctx.closePath();
      ctx.fillStyle = isInWater ? 'white' : 'red';
      ctx.fill();
      ctx.restore();

      // Update game state
      setGameState(prev => ({
        ...prev,
        x: newX,
        y: newY,
        dx,
        dy,
        isInWater,
        score: isInWater ? prev.score + 1 : prev.score
      }));

      // Continue game loop
      animationId = requestAnimationFrame(gameLoop);
    };

    // Wait for image to load before starting game
    if (!MAP_IMAGE.complete) {
      MAP_IMAGE.onload = () => {
        initCollisionCanvas();
        gameLoop();
      };
    } else {
      initCollisionCanvas();
      gameLoop();
    }

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
        <div className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            className="bg-blue-300 rounded-lg shadow-xl"
          />
          <canvas
            ref={collisionCanvasRef}
            className="hidden"  // Hidden collision detection canvas
          />
          <div className="text-white text-xl mt-4">
            <p>Score: {gameState.score}</p>
            <p className="text-sm mt-2">
              {gameState.isInWater ? "Sailing smoothly! ⛵" : "Watch out for land! 🚫"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
