// ============================================================
// Site metadata & global constants
// ============================================================

export const SITE_TITLE = "Trinetra — AI Engineer & Full-Stack Developer";
export const SITE_DESCRIPTION =
  "AI Engineer and Full-Stack Developer building intelligent systems at the intersection of AI, software, and connected technology. Based in Vellore, India.";
export const SITE_URL = "https://trinetrayelukuru.github.io";

export const PROFILE = {
  fullName: "Yelukuru Trinetra Naga Sai",
  displayName: "Trinetra",
  title: "AI-Focused Software Developer",
  email: "yelukurutrinetra@gmail.com",
  github: "https://github.com/trinetrayelukuru",
  gitHub: "https://github.com/trinetrayelukuru",
  linkedin: "https://www.linkedin.com/in/yelkuru-trinetra-11b75124b",
  location: "Vellore, India",
  heroBio:
    "Building intelligent systems at the intersection of AI, software and connected technology.",
  /** Short hero identity line — no job title or experience claimed. */
  heroSubtitle:
    "Computer Science & Engineering graduate (IoT) from VIT Vellore, building AI applications, web products and interactive interfaces.",
  /** Rotating role / interest line shown in the hero and the About section. */
  roles: [
    "AI APPLICATION DEVELOPER",
    "SOFTWARE DEVELOPER",
    "FULL-STACK WEB BUILDER",
    "UI/UX & FRONTEND",
    "LLMs · RAG · LOCAL AI",
    "IoT & CLOUD PROJECTS",
  ],
  aboutParagraphs: [
    "I'm Yelukuru Trinetra Naga Sai — a Computer Science and Engineering graduate from VIT Vellore, where I specialised in the Internet of Things and studied with a CGPA of 7.6/10. I work where artificial intelligence, software engineering and interface design meet: building applications that put AI models to practical use, wiring them into real products, and shaping how they feel to use.",
    "Most of that work has been AI and web projects built end to end. I built an offline AI assistant that runs entirely on Android through Termux with local language models — Qwen2.5-Coder for coding help and SmolVLM for image understanding — and TutorAI, a learning assistant that teaches Operating Systems concepts step by step, checks answers and generates practice work. Alongside those I've worked on AI summarisation tools in Python with Hugging Face, and on web projects such as Ranaha Gold (Next.js, React and Tailwind CSS with live metal-rate integration) and CloudVault, an academic secure cloud-storage project with a local prototype, authentication and file-integrity features.",
    "I care about how these things feel to use, not only how they work. I design in Figma, prototype interactive frontends, and spend a lot of time on typography, motion and accessibility. That runs parallel to cloud fundamentals such as AWS storage and compute, and to IoT work with Arduino and sensor integration. I've taken part in hackathons and designathons, including a 12th-place finish in a UI/UX-focused designathon. Right now I'm an early-career developer looking for a team where I can keep building AI-driven products end to end.",
  ],
  focusAreas: [
    "AI applications",
    "LLMs & RAG",
    "Offline / local AI",
    "Full-stack web",
    "UI/UX & Figma",
    "Cloud fundamentals",
    "IoT & embedded",
  ],
};

// ============================================================
// Skills
// Grouped exactly as claimed — no proficiency scores, years or
// certifications are implied. `SkillsNew` renders these groups.
// ============================================================

export interface SkillGroup {
  id: string;
  label: string;
  icon: string;
  accent: string;
  skills: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "programming-web",
    label: "Programming & Web Development",
    icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z",
    accent: "#00FF66",
    skills: [
      "Python",
      "C",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
      "React",
      "Next.js",
      "Node.js",
      "Responsive web development",
      "REST APIs",
    ],
  },
  {
    id: "ai-ml",
    label: "AI & Machine Learning",
    icon: "M12 3v3m0 12v3M4.2 7.5l2.6 1.5m10.4 6l2.6 1.5M4.2 16.5l2.6-1.5m10.4-6l2.6-1.5M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    accent: "#00E5FF",
    skills: [
      "Large Language Models (LLMs)",
      "Retrieval-Augmented Generation (RAG)",
      "Hugging Face",
      "AI application development",
      "Prompt engineering",
      "Text summarisation",
      "Offline AI model integration",
    ],
  },
  {
    id: "cloud-iot",
    label: "Cloud & IoT",
    icon: "M3 15a4 4 0 0 0 4 4h9a5 5 0 0 0 0-10h2.5a4 4 0 0 0 0-8H7",
    accent: "#7C3AED",
    skills: [
      "AWS fundamentals",
      "Cloud architecture",
      "Internet of Things (IoT)",
      "Arduino",
      "Sensor integration",
    ],
  },
  {
    id: "databases-security",
    label: "Databases & Security",
    icon: "M4 7c0 1.657 3.582 3 8 3s8-1.343 8-3-3.582-3-8-3-8 1.343-8 3zM4 7v10c0 1.657 3.582 3 8 3s8-1.343 8-3V7",
    accent: "#3B82F6",
    skills: [
      "SQL",
      "SQLite",
      "Authentication",
      "Multi-factor authentication (MFA)",
      "WebAuthn and passkeys",
      "Data encryption fundamentals",
    ],
  },
  {
    id: "tools-design",
    label: "Tools & Design",
    icon: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
    accent: "#F59E0B",
    skills: [
      "Git",
      "GitHub",
      "Figma",
      "UI/UX design",
      "Visual interface design",
      "Wireshark",
      "Cisco Packet Tracer",
      "Visual Studio Code",
      "Linux and Termux",
    ],
  },
];

/** Legacy grouped shape still consumed by the unused `Skills.tsx` prototype. */
export const SKILLS = {
  programming: ["Python", "C", "JavaScript", "TypeScript", "HTML", "CSS", "React", "Next.js", "Node.js"],
  frontend: ["React", "Next.js", "HTML", "CSS", "JavaScript", "UI/UX design", "Responsive web development"],
  backend: ["Node.js", "REST APIs"],
  ai: SKILL_GROUPS[1].skills,
  cloud: SKILL_GROUPS[2].skills,
  databases: ["SQL", "SQLite"],
  security: ["Authentication", "Multi-factor authentication (MFA)", "WebAuthn and passkeys", "Data encryption fundamentals"],
  tools: SKILL_GROUPS[4].skills,
};

// ============================================================
// Projects
// ============================================================

export type ProjectCategory = "ai" | "web" | "cloud" | "iot" | "systems" | "other";

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo?: string;
  featured: boolean;
  category: ProjectCategory;
  imageLight?: string;
  imageDark?: string;
  alt: string;
}

export const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  ai: "#00FF66",
  web: "#00E5FF",
  cloud: "#7C3AED",
  iot: "#EC4899",
  systems: "#F59E0B",
  other: "#A7B0B0",
};

export const PROJECTS: Project[] = [
  {
    id: "offline-ai-assistant",
    category: "ai",
    title: "Offline AI Assistant",
    description:
      "An AI assistant that runs entirely offline on Android using Termux, combining Qwen2.5-Coder for coding assistance and SmolVLM for image understanding — privacy-focused local inference.",
    tech: ["Termux", "llama.cpp", "Qwen2.5-Coder", "SmolVLM", "Android"],
    github: "https://github.com/trinetrayelukuru/Offline-AI-Assistant",
    featured: true,
    alt: "Offline AI Assistant interface",
  },
  {
    id: "file-summariser",
    category: "ai",
    title: "AI / LLM File Summariser",
    description:
      "An AI-powered application for summarising files and documents using LLMs, supporting multiple document formats with configurable summarisation styles.",
    tech: ["Python", "LLM APIs", "Hugging Face"],
    github: "https://github.com/trinetrayelukuru/AI-LLM-File-Summariser",
    featured: true,
    alt: "File summariser interface",
  },
  {
    id: "tutorai",
    category: "ai",
    title: "TutorAI",
    description:
      "An AI teaching assistant that interactively teaches Operating Systems concepts, asks questions, evaluates answers, and provides practice problems.",
    tech: ["Python", "LLM APIs", "Next.js"],
    github: "https://github.com/trinetrayelukuru/TutorAI",
    featured: true,
    alt: "TutorAI teaching interface",
  },
  {
    id: "cloudvault",
    category: "cloud",
    title: "CloudVault",
    description:
      "An academic cloud-based document storage project implementing AWS concepts — S3 for object storage, EFS for file storage, EC2 for compute, with security and authentication.",
    tech: ["AWS", "S3", "EFS", "EC2", "Node.js", "MongoDB"],
    github: "https://github.com/trinetrayelukuru/CloudVault",
    featured: true,
    alt: "CloudVault dashboard",
  },
  {
    id: "ranaha-gold",
    category: "web",
    title: "Ranaha Gold Website",
    description:
      "A modern business website for a gold trading company featuring responsive UI, animations, live metal-rate functionality, and franchise/business sections.",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion", "JavaScript"],
    github: "https://github.com/trinetrayelukuru/Ranaha-Gold-Website",
    featured: true,
    alt: "Ranaha Gold website",
  },
  {
    id: "samsung-inspired",
    category: "web",
    title: "Samsung-inspired Website",
    description:
      "A UI/UX-focused website inspired by Samsung's design language, showcasing modern design principles and responsive layouts.",
    tech: ["React", "CSS", "Framer Motion", "JavaScript"],
    github: "https://github.com/trinetrayelukuru/Samsung-inspired",
    featured: false,
    alt: "Samsung-inspired website design",
  },
];

// ============================================================
// Experience
// ============================================================

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
  techStack: string[];
}

// Intentionally empty: the Cisco IoT internship entry was removed. The section
// and its nav link are only rendered when this array has entries.
export const EXPERIENCE: ExperienceEntry[] = [];

// ============================================================
// Education
// ============================================================

export const EDUCATION = [
  {
    id: "vit",
    degree: "B.Tech in Computer Science and Engineering",
    institution: "VIT Vellore",
    specialisation: "Internet of Things (IoT)",
    duration: "2022 — 2028",
    cgpa: "7.6 / 10",
    focus: ["IoT systems", "AI & machine learning", "Cloud & networking"],
  },
];

// ============================================================
// Achievements
// ============================================================

export const ACHIEVEMENTS = [
  {
    id: "best-fresher",
    title: "Best Fresher Recognition",
    description:
      "Awarded 'Best Fresher' for an AI file summariser project during academic evaluation.",
    category: "Academic",
  },
  {
    id: "hackathon",
    title: "Hackathon Participation",
    description:
      " Participated in university-level hackathons building real-time AI and IoT solutions.",
    category: "Events",
  },
  {
    id: "designathon",
    title: "Designathon — 12th Place",
    description:
      "Finished 12th in a designathon focused on UI/UX and product design.",
    category: "Events",
  },
];

// ============================================================
// Navigation
// ============================================================

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "GitHub Live", href: "#github" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  // Only advertise a section that actually has entries to show.
  ...(EXPERIENCE.length > 0 ? [{ label: "Experience", href: "#experience" }] : []),
  { label: "Education", href: "#education" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

// ============================================================
// Social & Contact
// ============================================================

export const SOCIAL_LINKS = {
  github: {
    name: "GitHub",
    url: "https://github.com/trinetrayelukuru",
    icon: "github",
  },
  linkedin: {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/yelkuru-trinetra-11b75124b",
    icon: "linkedin",
  },
  email: {
    name: "Email",
    url: "mailto:yelukurutrinetra@gmail.com",
    icon: "email",
  },
};

// ============================================================
// Theme Colors (used for accents)
// ============================================================

export const ACCENT_COLORS = {
  primary: "from-indigo-500 to-blue-500",
  secondary: "from-purple-500 to-pink-500",
  gradient:
    "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent",
};
