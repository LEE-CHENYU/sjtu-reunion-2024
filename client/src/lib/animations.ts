import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const staggerChildren: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const bounceHover: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export const expandCard: Variants = {
  initial: { height: "auto" },
  expanded: {
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

export const slideIn: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { 
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

export const scrollFadeIn: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.2,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

export const scrollColorTransition = (progress: number) => ({
  background: `linear-gradient(to br, 
    hsl(210, ${85 + progress * 10}%, ${60 + progress * 5}%),
    hsl(220, ${85 + progress * 5}%, ${60 + progress * 10}%)
  )`
});

export const parallaxEffect = (scrollProgress: number) => ({
  y: scrollProgress * 30,
  transition: { type: "spring", stiffness: 100 }
});
