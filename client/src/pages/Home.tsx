import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white"
        >
          <h1 className="text-6xl font-bold mb-8">✨ Party Planner Pro</h1>
          <p className="text-xl mb-12">Plan your perfect event and join our vibrant community!</p>
          
          <div className="flex gap-6 justify-center">
            <Link href="/survey">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-100">
                Start Survey 📝
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                Join Community 💬
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
