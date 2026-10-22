"use client";
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PROFILE } from "../lib/constants";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70">
                <span className="relative w-1.5 h-1.5 rounded-full bg-indigo-400" />
                AI Engineer & Full-Stack Developer
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight text-white">
              Building intelligent systems at the intersection of
              <br />
              <span className="font-semibold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                AI, software & connected technology
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/60 max-w-xl leading-relaxed font-light">
              {PROFILE.heroBio}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-400 hover:to-blue-500 transition-all shadow-lg shadow-indigo-500/20"
              >
                View Projects
              </Link>
              <a
                href="https://github.com/trinetrayelukuru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                GitHub
              </a>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm text-white/70 hover:text-white transition-colors"
              >
                Contact Me
              </Link>
            </div>

            {/* Tech stack preview */}
            <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-white/10">
              <span className="text-xs text-white/40 uppercase tracking-wider">
                Working with:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {["Next.js", "Python", "React", "LLMs", "IoT", "Node.js"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/70"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>
          </motion.div>

          {/* Right: Visual element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Main visual - animated neural network / connection visualization */}
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full"
                aria-hidden="true"
              >
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Grid background */}
                <rect
                  width="400"
                  height="400"
                  fill="url(#grid)"
                  opacity="0.08"
                />
                <defs>
                  <pattern
                    id="grid"
                    width="30"
                    height="30"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>

                {/* Animated connection lines */}
                <g filter="url(#glow)">
                  <motion.line
                    x1="100"
                    y1="100"
                    x2="200"
                    y2="150"
                    stroke="url(#grad1)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 300 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                    style={{ strokeDasharray: 150 }}
                  />
                  <motion.line
                    x1="200"
                    y1="150"
                    x2="300"
                    y2="100"
                    stroke="url(#grad2)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 300 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 2, delay: 0.7, ease: "easeOut" }}
                    style={{ strokeDasharray: 150 }}
                  />
                  <motion.line
                    x1="100"
                    y1="300"
                    x2="200"
                    y2="250"
                    stroke="url(#grad3)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 300 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 2, delay: 0.9, ease: "easeOut" }}
                    style={{ strokeDasharray: 150 }}
                  />
                  <motion.line
                    x1="200"
                    y1="250"
                    x2="300"
                    y2="300"
                    stroke="url(#grad1)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 300 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 2, delay: 1.1, ease: "easeOut" }}
                    style={{ strokeDasharray: 150 }}
                  />
                  <motion.line
                    x1="200"
                    y1="150"
                    x2="200"
                    y2="250"
                    stroke="url(#grad2)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 300 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 2, delay: 1.3, ease: "easeOut" }}
                    style={{ strokeDasharray: 150 }}
                  />
                </g>

                {/* Nodes */}
                <motion.circle
                  cx="200"
                  cy="150"
                  r="14"
                  fill="url(#grad1)"
                  className="filter"
                  style={{ filter: "url(#glow)" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="10"
                  fill="url(#grad2)"
                  className="filter"
                  style={{ filter: "url(#glow)" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.15, 1], opacity: 1 }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
                />
                <motion.circle
                  cx="300"
                  cy="100"
                  r="10"
                  fill="url(#grad3)"
                  className="filter"
                  style={{ filter: "url(#glow)" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.15, 1], opacity: 1 }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
                />
                <motion.circle
                  cx="100"
                  cy="300"
                  r="10"
                  fill="url(#grad1)"
                  className="filter"
                  style={{ filter: "url(#glow)" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.15, 1], opacity: 1 }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1.0 }}
                />
                <motion.circle
                  cx="300"
                  cy="300"
                  r="10"
                  fill="url(#grad2)"
                  className="filter"
                  style={{ filter: "url(#glow)" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.15, 1], opacity: 1 }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
                />
                <motion.circle
                  cx="200"
                  cy="250"
                  r="14"
                  fill="url(#grad3)"
                  className="filter"
                  style={{ filter: "url(#glow)" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                />

                {/* Gradients */}
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                  <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Labels */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-0 -translate-y-1/2 text-left px-2">
                  <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">
                    AI Models
                  </span>
                  <span className="text-sm font-medium text-white">Qwen2.5-Coder</span>
                </div>
                <div className="absolute top-1/4 right-0 -translate-y-1/2 text-right px-2">
                  <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">
                    Vision
                  </span>
                  <span className="text-sm font-medium text-white">SmolVLM</span>
                </div>
                <div className="absolute bottom-1/4 left-0 translate-y-1/2 text-left px-2">
                  <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">
                    Runtime
                  </span>
                  <span className="text-sm font-medium text-white">Termux + llama.cpp</span>
                </div>
                <div className="absolute bottom-1/4 right-0 translate-y-1/2 text-right px-2">
                  <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">
                    Platform
                  </span>
                  <span className="text-sm font-medium text-white">Android</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/40"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}