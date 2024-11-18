import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, Marker, Popup, useMapEvents } from "react-leaflet";
import { Icon, LatLng } from "leaflet";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useSWR, { mutate } from "swr";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "leaflet/dist/leaflet.css"; // Add this line to import Leaflet's CSS

// Target location coordinates
const TARGET_LOCATION = {
  lat: 31.017969,
  lng: 121.430860,
  name: "拖鞋门"
};

interface GameState {
  guessPosition: { lat: number; lng: number } | null;
  distance: number | null;
  attempts: number;
  bestDistance: number;
  isGameOver: boolean;
  showTarget: boolean;
}

interface Score {
  id: number;
  distance: number;
  attempts: number;
  created_at: string;
}

// Calculate distance between two points in kilometers
function calculateDistance(guess: { lat: number; lng: number }, target: { lat: number; lng: number }): number {
  const R = 6371; // Earth's radius in km
  const dLat = (target.lat - guess.lat) * Math.PI / 180;
  const dLon = (target.lng - guess.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(guess.lat * Math.PI / 180) * Math.cos(target.lat * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function MapEvents({ onMapClick }: { onMapClick: (latlng: LatLng) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function GameComponent() {
  const [gameState, setGameState] = useState<GameState>({
    guessPosition: null,
    distance: null,
    attempts: 0,
    bestDistance: Infinity,
    isGameOver: false,
    showTarget: false,
  });

  const { data: leaderboard } = useSWR<Score[]>("/api/game/leaderboard");

  const handleMapClick = (latlng: LatLng) => {
    if (gameState.isGameOver) return;

    setGameState(prev => ({
      ...prev,
      guessPosition: { lat: latlng.lat, lng: latlng.lng },
    }));
  };

  const handleSubmitGuess = async () => {
    if (!gameState.guessPosition) return;

    const distance = calculateDistance(gameState.guessPosition, TARGET_LOCATION);
    const attempts = gameState.attempts + 1;
    const bestDistance = Math.min(distance, gameState.bestDistance);

    // Save score to the database
    await fetch("/api/game/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ distance, attempts }),
    });

    // Update leaderboard
    mutate("/api/game/leaderboard");

    setGameState(prev => ({
      ...prev,
      distance,
      attempts,
      bestDistance,
      isGameOver: true,
      showTarget: true,
    }));
  };

  const handleTryAgain = () => {
    setGameState({
      guessPosition: null,
      distance: null,
      attempts: gameState.attempts,
      bestDistance: gameState.bestDistance,
      isGameOver: false,
      showTarget: false,
    });
  };

  // Custom marker icons
  const guessIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const targetIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="min-h-screen p-8 pt-20 bg-gradient-to-br from-blue-400 to-blue-600">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">SJTU Campus Explorer 🎯</h1>
          <p className="text-lg mb-2">Find 拖鞋门 (Slipper Gate) on the map!</p>
          <p className="text-sm opacity-80">Click anywhere on the map to make your guess. How close can you get?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{gameState.attempts}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Distance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {gameState.distance ? `${gameState.distance.toFixed(2)} km` : "-"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best Distance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {gameState.bestDistance !== Infinity ? `${gameState.bestDistance.toFixed(2)} km` : "-"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">
                {gameState.isGameOver ? "Make another attempt!" : "Place your guess"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardContent className="p-0">
                <div className="h-[600px] rounded-lg overflow-hidden">
                  <MapContainer
                    center={[31.2304, 121.4737]}
                    zoom={11}
                    style={{ height: "100%", width: "100%" }}
                    maxBounds={[[30.7, 121.0], [31.5, 122.0]]}
                    minZoom={11}
                    maxZoom={11}
                    zoomControl={false}
                    attributionControl={false}
                    scrollWheelZoom={false}
                    doubleClickZoom={false}
                    touchZoom={false}
                    dragging={true}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      opacity={0.5}
                    />
                    <MapEvents onMapClick={handleMapClick} />

                    {gameState.guessPosition && (
                      <Marker
                        position={[gameState.guessPosition.lat, gameState.guessPosition.lng]}
                        icon={guessIcon}
                      >
                        <Popup>Your guess</Popup>
                      </Marker>
                    )}

                    {gameState.showTarget && (
                      <Marker
                        position={[TARGET_LOCATION.lat, TARGET_LOCATION.lng]}
                        icon={targetIcon}
                      >
                        <Popup>{TARGET_LOCATION.name}</Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 mt-4">
              <Button
                size="lg"
                onClick={handleSubmitGuess}
                disabled={!gameState.guessPosition || gameState.isGameOver}
                className="w-full"
              >
                Submit Guess
              </Button>
              <Button
                size="lg"
                onClick={handleTryAgain}
                disabled={!gameState.isGameOver}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Leaderboard 🏆</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard?.map((score, index) => (
                  <div key={score.id} className="flex flex-col gap-2 p-2 border-b">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">#{index + 1}</span>
                      <span>{score.distance.toFixed(2)} km</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Attempt #{score.attempts}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

export default function Game() {
  return (
    <ErrorBoundary>
      <GameComponent />
    </ErrorBoundary>
  );
}