import { Link, useLocation } from "wouter";
import { Button } from "./button";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Separate component for navigation links
interface NavigationLinksProps {
  location: string;
  onClick?: () => void;
}

function NavigationLinks({ location, onClick }: NavigationLinksProps) {
  return (
    <>
      <Link href="/survey" onClick={onClick}>
        <Button
          variant="ghost"
          className={cn(
            "text-white hover:bg-blue-800/30",
            location === "/survey" && "bg-blue-800/30"
          )}
        >
          Survey 📝
        </Button>
      </Link>
      <Link href="/community" onClick={onClick}>
        <Button
          variant="ghost"
          className={cn(
            "text-white hover:bg-blue-800/30",
            location === "/community" && "bg-blue-800/30"
          )}
        >
          Community 💬
        </Button>
      </Link>
      <Link href="/dashboard" onClick={onClick}>
        <Button
          variant="ghost"
          className={cn(
            "text-white hover:bg-blue-800/30",
            location === "/dashboard" && "bg-blue-800/30"
          )}
        >
          Dashboard 📊
        </Button>
      </Link>
      <Link href="/game" onClick={onClick}>
        <Button
          variant="ghost"
          className={cn(
            "text-white hover:bg-blue-800/30",
            location === "/game" && "bg-blue-800/30"
          )}
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

  // Add this function to handle navigation clicks
  const handleNavClick = () => {
    setIsMenuOpen(false); // Close menu when a navigation item is clicked
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-900/20 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" onClick={handleNavClick}>
            <Button variant="ghost" className="text-white hover:bg-blue-800/30">
              🎈 SJTU Reunion
            </Button>
          </Link>
          
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
            <NavigationLinks location={location} onClick={handleNavClick} />
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <NavigationLinks location={location} onClick={handleNavClick} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
