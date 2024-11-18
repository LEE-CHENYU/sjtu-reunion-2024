import { Link, useLocation } from "wouter";
import { Button } from "./button";

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-900/20 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-blue-800/30">
              🎈 SJTU Reunion
            </Button>
          </Link>
          <div className="flex space-x-4">
            <Link href="/survey">
              <Button
                variant={location === "/survey" ? "default" : "ghost"}
                className="text-white hover:bg-blue-800/30"
              >
                Survey 📝
              </Button>
            </Link>
            <Link href="/community">
              <Button
                variant={location === "/community" ? "default" : "ghost"}
                className="text-white hover:bg-blue-800/30"
              >
                Community 💬
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant={location === "/dashboard" ? "default" : "ghost"}
                className="text-white hover:bg-blue-800/30"
              >
                Dashboard 📊
              </Button>
            </Link>
            <Link href="/game">
              <Button
                variant={location === "/game" ? "default" : "ghost"}
                className="text-white hover:bg-blue-800/30"
              >
                Game 🚢
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
