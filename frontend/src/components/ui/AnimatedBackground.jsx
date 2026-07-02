import React from "react";

/* Floating particles (CSS-only, lightweight) */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 15,
  duration: Math.random() * 12 + 14,
  opacity: Math.random() * 0.3 + 0.1,
}));

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* === Radial gradient mesh === */}
      <div
        className="absolute w-[900px] h-[900px] rounded-full animate-float-slow"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          top: "-20%",
          left: "-15%",
        }}
      />
      <div
        className="absolute w-[700px] h-[700px] rounded-full animate-float-slow"
        style={{
          background: "radial-gradient(circle, rgba(192,38,211,0.12) 0%, transparent 70%)",
          top: "30%",
          right: "-20%",
          animationDelay: "-3s",
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full animate-float-slow"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
          bottom: "-10%",
          left: "25%",
          animationDelay: "-7s",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full animate-float"
        style={{
          background: "radial-gradient(circle, rgba(244,63,94,0.08) 0%, transparent 70%)",
          top: "60%",
          left: "-10%",
          animationDelay: "-5s",
        }}
      />

      {/* === Subtle dot grid === */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(168,85,247,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* === Floating particles === */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `rgba(168,85,247,${p.opacity})`,
            boxShadow: `0 0 ${p.size * 3}px rgba(168,85,247,${p.opacity * 0.5})`,
            animation: `particle-drift ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
