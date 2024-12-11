import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { Icon, LatLng } from "leaflet";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useSWR, { mutate } from "swr";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  distance: string;
  attempts: string;
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

    try {
      const distance = calculateDistance(gameState.guessPosition, TARGET_LOCATION);
      const attempts = gameState.attempts + 1;
      const bestDistance = Math.min(distance, gameState.bestDistance);

      // Ensure we're sending numeric types
      const scoreData = {
        distance: Number(distance.toFixed(2)),
        attempts: attempts
      };

      await fetch("/api/game/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scoreData),
      });

      setGameState(prev => ({
        ...prev,
        distance,
        attempts,
        bestDistance,
        isGameOver: true,
        showTarget: true,
      }));

      mutate("/api/game/leaderboard");
    } catch (error) {
      console.error("Error submitting score:", error);
    }
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

  // Add this at the top level of your component to debug
  console.log('Leaderboard data:', leaderboard);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 animate-gradient">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-white/20 rounded-full filter blur-3xl animate-blob" />
          <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-300/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        </div>
      </div>

      <div className="container relative mx-auto px-4 py-20">
        <div className="text-white mb-8">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">SJTU Campus Explorer 🎯</h1>
          <p className="text-lg mb-2 text-white/90">Find 拖鞋门 (Slipper Gate) on the map!</p>
          <p className="text-sm opacity-80">Click anywhere on the map to make your guess. How close can you get?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{gameState.attempts}</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Current Distance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {gameState.distance ? `${gameState.distance.toFixed(2)} km` : "-"}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Best Distance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {gameState.bestDistance !== Infinity ? `${gameState.bestDistance.toFixed(2)} km` : "-"}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
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
            <Card className="glass-card">
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
                      lang="ja"
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

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Leaderboard 🏆</CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboard && leaderboard.length > 0 ? (
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full auto-cols-fr grid-flow-col gap-2 mb-4 p-1 h-auto">
                    <TabsTrigger 
                      value="all" 
                      className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 px-3 py-2"
                    >
                      All
                    </TabsTrigger>
                    {Object.keys(
                      leaderboard.reduce((acc, score) => {
                        if (parseInt(score.attempts) <= 3) {
                          acc[score.attempts] = true;
                        }
                        return acc;
                      }, {} as Record<number, boolean>)
                    )
                    .sort((a, b) => parseInt(a) - parseInt(b))
                    .map((attempts) => (
                      <TabsTrigger 
                        key={attempts} 
                        value={attempts}
                        className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 px-3 py-2 whitespace-nowrap"
                      >
                        {attempts} {parseInt(attempts) === 1 ? 'Try' : 'Tries'}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="all" className="space-y-6">
                    {Object.entries(
                      leaderboard.reduce((acc, score) => {
                        const key = score.attempts.toString();
                        if (parseInt(key) <= 3) {
                          if (!acc[key]) acc[key] = [];
                          acc[key].push(score);
                        }
                        return acc;
                      }, {} as Record<string, typeof leaderboard>)
                    )
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .map(([attempts, scores]) => (
                      <div key={attempts} className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-500 border-b pb-2">
                          {attempts} {parseInt(attempts) === 1 ? 'Attempt' : 'Attempts'}
                        </h3>
                        <div className="space-y-3">
                          {scores
                            .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
                            .slice(0, 3)
                            .map((score, index) => (
                              <div 
                                key={score.id} 
                                className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-gray-500 w-6">{index + 1}.</span>
                                  <span className="font-medium">
                                    {parseFloat(score.distance).toFixed(2)} km
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  {Object.entries(
                    leaderboard.reduce((acc, score) => {
                      const key = score.attempts.toString();
                      if (parseInt(key) <= 3) {
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(score);
                      }
                      return acc;
                    }, {} as Record<string, typeof leaderboard>)
                  )
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([attempts, scores]) => (
                    <TabsContent key={attempts} value={attempts} className="space-y-3">
                      {scores
                        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
                        .slice(0, 3)
                        .map((score, index) => (
                          <div 
                            key={score.id} 
                            className="flex justify-between items-center p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-gray-500 w-6">{index + 1}.</span>
                              <span className="font-medium">
                                {parseFloat(score.distance).toFixed(2)} km
                              </span>
                            </div>
                          </div>
                        ))}
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No scores yet</p>
                  <p className="text-sm mt-1">Be the first to play!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
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
