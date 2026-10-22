"use client";
import { motion } from "framer-motion";
import { SKILLS } from "../lib/constants";

// Inline stroke SVGs (decorative — each card's title carries the accessible
// name). Paths reuse the same 24x24 vocabulary as SkillsNew for consistency.
const SKILL_CATEGORIES = [
  {
    title: "Programming",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
      />
    ),
    color: "from-indigo-400 to-blue-500",
    items: SKILLS.programming,
  },
  {
    title: "Frontend",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zM4 9h16"
      />
    ),
    color: "from-purple-400 to-pink-500",
    items: SKILLS.frontend,
  },
  {
    title: "Backend",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.066-2.573c-1.543.94-3.31-.826-2.37 2.37a1.724 1.724 0 0 0-1.066-2.573c.996.608 2.296.07 2.572-1.065z"
      />
    ),
    color: "from-blue-400 to-cyan-500",
    items: SKILLS.backend,
  },
  {
    title: "AI & ML",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    ),
    color: "from-pink-400 to-orange-500",
    items: SKILLS.ai,
  },
  {
    title: "Databases",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7c0 1.657 3.582 3 8 3s8-1.343 8-3-3.582-3-8-3-8 1.343-8 3zM4 7c0 1.657 3.582 3 8 3s8-1.343 8-3M4 7c0-1.657 3.582-3 8-3s8 1.343 8 3m0 5c0 1.657 3.582 3 8 3s8-1.343 8-3"
      />
    ),
    color: "from-green-400 to-teal-500",
    items: SKILLS.databases,
  },
  {
    title: "Cloud & Security",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 2v6M15 2v6M7 8h10v3a5 5 0 0 1-10 0V8zM12 16v6"
      />
    ),
    color: "from-yellow-400 to-orange-500",
    items: SKILLS.cloud,
  },
  {
    title: "Tools",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      />
    ),
    color: "from-indigo-400 to-purple-500",
    items: SKILLS.tools,
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <header className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 text-white/70">
            <span className="relative w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Skills
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl font-light tracking-tight text-white">
            What I work with
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto text-sm sm:text-base">
            A toolkit spanning AI, full-stack development, and embedded systems.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKILL_CATEGORIES.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-xl p-6 bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${category.color} shadow-lg`}
                  aria-hidden="true"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    {category.icon}
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white">
                  {category.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs rounded-md bg-white/5 border border-white/10 text-white/70 group-hover:border-white/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}