import { Link, useLocation } from "wouter";
import { Button } from "./button";
import { useState } from "react";

// Separate component for navigation links
function NavigationLinks({ location, onSelect }: { location: string; onSelect?: () => void }) {
  const handleClick = () => {
    if (onSelect) onSelect();
  };

  return (
    <>
      <Link href="/survey" onClick={handleClick}>
        <Button
          variant={location === "/survey" ? "default" : "ghost"}
          className="text-white hover:bg-blue-800/30 w-full md:w-auto"
        >
          Survey 📝
        </Button>
      </Link>
      <Link href="/community" onClick={handleClick}>
        <Button
          variant={location === "/community" ? "default" : "ghost"}
          className="text-white hover:bg-blue-800/30 w-full md:w-auto"
        >
          Community 💬
        </Button>
      </Link>
      <Link href="/dashboard" onClick={handleClick}>
        <Button
          variant={location === "/dashboard" ? "default" : "ghost"}
          className="text-white hover:bg-blue-800/30 w-full md:w-auto"
        >
          Dashboard 📊
        </Button>
      </Link>
      <Link href="/game" onClick={handleClick}>
        <Button
          variant={location === "/game" ? "default" : "ghost"}
          className="text-white hover:bg-blue-800/30 w-full md:w-auto"
        >
          Game 🚢
        </Button>
      </Link>
    </>
  );
}

export function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-900/20 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" className="text-white hover:bg-blue-800/30">
              🎈 SJTU Reunion
            </Button>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="text-white hover:bg-blue-800/30"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </Button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-4">
            <NavigationLinks location={location} />
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <NavigationLinks location={location} onSelect={() => setIsMenuOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
