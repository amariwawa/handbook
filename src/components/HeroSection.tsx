import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-graduates.jpg";

export const HeroSection = () => {
  const [isLight, setIsLight] = useState(
    typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-theme") === "light"
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(
        document.documentElement.getAttribute("data-theme") === "light"
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  const [typed, setTyped] = useState("");
  useEffect(() => {
    const word = "learning...";
    let i = 0;
    let phase: "typing" | "pause" | "clear" = "typing";
    const tick = () => {
      if (phase === "typing") {
        setTyped(word.slice(0, i + 1));
        i++;
        if (i >= word.length) phase = "pause";
      } else if (phase === "clear") {
        setTyped("");
        i = 0;
        phase = "typing";
      }
    };
    const typingTimer = setInterval(() => {
      if (phase === "typing") tick();
    }, 120);
    const cycleTimer = setInterval(() => {
      if (phase === "pause") {
        phase = "clear";
      } else if (phase === "clear") {
        tick();
      }
    }, 1000);
    return () => {
      clearInterval(typingTimer);
      clearInterval(cycleTimer);
    };
  }, []);
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Nigerian graduates celebrating"
          className={`w-full h-full object-cover object-center ${isLight ? "brightness-105 contrast-105" : ""}`}
        />
        <div className={`absolute inset-0 ${isLight ? "bg-gradient-to-b from-background/30 via-background/20 to-background/30" : "bg-gradient-to-b from-background/80 via-background/70 to-background"}`} />
        <div className={`absolute inset-0 ${isLight ? "bg-gradient-to-r from-background/40 via-transparent to-background/40" : "bg-gradient-to-r from-background/90 via-transparent to-background/90"}`} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * -200],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 pt-32">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Learning Platform</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="section-title mb-6"
          >
            Master{" "}
            <span className="italic-accent text-primary">BECE, WAEC</span>
            <br />
            <span className="italic-accent">&</span>{" "}
            <span className="italic-accent text-primary">JAMB</span> with
            <br />
            AI-Powered{" "}
            <span className="italic-accent text-primary">
              {typed || "Learning"}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`section-subtitle mb-10 ${isLight ? "text-black" : ""}`}
          >
            Your personal AI tutor that explains every question, understands your 
            learning style, and adapts to help you excel in Nigerian examinations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <a href="#pricing" className="btn-primary flex items-center gap-2 group">
              Start Learning Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#about" className="btn-secondary">
              About Us
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-12 mt-16"
          >
            {[
              { value: "50K+", label: "Students" },
              { value: "10K+", label: "Questions" },
              { value: "98%", label: "Pass Rate" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-display font-semibold text-gradient">
                  {stat.value}
                </div>
                <div className={`${isLight ? "text-black" : "text-muted-foreground"} text-sm`}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
