"use client";
export default function CyberGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg className="w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cyber" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M50 0L0 0 0 50" fill="none" stroke="#00FF66" strokeWidth="0.5"/>
            <circle cx="25" cy="25" r="1" fill="#00E5FF"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyber)"/>
      </svg>
    </div>
  );
}
