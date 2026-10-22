"use client";
import { motion } from "framer-motion";
import { PROFILE } from "../lib/constants";

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <header className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 text-white/70">
            <span className="relative w-1.5 h-1.5 rounded-full bg-indigo-400" />
            About Me
          </span>

          <h2 className="mt-6 text-3xl sm:text-4xl font-light tracking-tight text-white">
            Hello, I&apos;m {PROFILE.displayName}
          </h2>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Bio text */}
            <div>
              <p className="text-lg text-white/60 leading-relaxed">
                {PROFILE.aboutParagraphs[0]}
              </p>

              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span className="text-sm text-white/60">
                    Passionate about AI, full-stack development, and IoT
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-sm text-white/60">
                    Building practical applications that solve real problems
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-pink-400" />
                  <span className="text-sm text-white/60">
                    Always learning and exploring new technologies
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative h-64 w-full lg:h-[400px]">
              <div className="relative h-full w-full rounded-xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5" />
                <div className="relative h-full w-full">
                  <div className="absolute inset-0">
                    <svg
                      viewBox="0 0 600 400"
                      className="h-full w-full"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="bioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="50%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>

                      <path
                        d="M50 200 C150 100 250 50 300 200 C350 350 250 300 150 300 C50 300 50 250 50 200 Z"
                        fill="url(#bioGrad)"
                        opacity="0.15"
                      />

                      {/* Animated data flow lines */}
                      <g stroke="url(#bioGrad)" strokeWidth="2" fill="none" opacity="0.6">
                        <path d="M100 150 Q200 100 300 150" strokeDasharray="8" strokeDashoffset="0">
                          <animateTransform
                            attributeName="transform"
                            type="translate"
                            from="-200 0"
                            to="200 0"
                            dur="4s"
                            repeatCount="indefinite"
                          />
                        </path>
                        <path d="M150 250 Q250 200 350 250" strokeDasharray="8" strokeDashoffset="4">
                          <animateTransform
                            attributeName="transform"
                            type="translate"
                            from="-200 0"
                            to="200 0"
                            dur="3.5s"
                            repeatCount="indefinite"
                          />
                        </path>
                      </g>
                    </svg>
                  </div>

                  {/* Glowing nodes */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-indigo-400/30 backdrop-blur-sm"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                    className="absolute right-3/4 bottom-1/3 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-purple-400/30 backdrop-blur-sm"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="absolute left-3/4 bottom-1/4 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-pink-400/30 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="pt-12 border-t border-white/10">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-400" />
                  <span className="text-2xl font-semibold text-white">3+</span>
                </div>
                <p className="text-sm text-white/60">AI Projects</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-purple-400" />
                  <span className="text-2xl font-semibold text-white">5+</span>
                </div>
                <p className="text-sm text-white/60">Full-Stack Apps</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-pink-400" />
                  <span className="text-2xl font-semibold text-white">10+</span>
                </div>
                <p className="text-sm text-white/60">IoT Systems</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-300" />
                  <span className="text-2xl font-semibold text-white">200+</span>
                </div>
                <p className="text-sm text-white/60">Hours Built</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}