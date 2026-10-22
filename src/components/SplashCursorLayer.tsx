"use client";

import { useFxLevel } from "@/lib/fx";
import SplashCursor from "@/components/SplashCursor";

/**
 * The only mount point for the WebGL cursor effect. Keeping it in the root
 * layout means route changes never create a second canvas or simulation loop.
 */
export default function SplashCursorLayer() {
  const level = useFxLevel();
  const subtle = level === "subtle";

  return (
    <SplashCursor
      colors={["#00FF66", "#00E5FF", "#7C3AED"]}
      rainbow={false}
      size={0.8}
      force={subtle ? 0.35 : 0.7}
      swirl={subtle ? 1.5 : 3}
      trail={subtle ? 0.45 : 0.7}
      colorSpeed={0.6}
      intensity={subtle ? 0.35 : 0.7}
      momentum={0.7}
      shading={0.5}
      glow={0}
      quality="low"
      clickSplash={!subtle}
      intro={false}
      contained={false}
      theme="dark"
      zIndex={0}
      enabled={level !== "off"}
    />
  );
}
