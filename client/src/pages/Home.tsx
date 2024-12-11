import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 animate-gradient">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-white/20 rounded-full filter blur-3xl animate-blob" />
          <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-300/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-1/4 left-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="container relative mx-auto px-4 py-20 min-h-screen flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white w-full"
        >
          <h1 className="text-6xl font-bold mb-8 drop-shadow-lg">✨ SJTU北美互助会2024 Reunion</h1>
          <p className="text-xl mb-12 text-white/90">Join us for the SJTU North America Alumni reunion and help shape our gathering!</p>
          
          <div className="flex gap-6 justify-center">
            <Link href="/survey">
              <Button size="lg" className="glass hover:bg-white/20 text-white border-white/20">
                Start Survey 📝
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" variant="outline" className="glass-dark text-white border-white/20 hover:bg-white/10">
                Join Community 💬
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
