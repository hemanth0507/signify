import React from "react";
import { motion } from "framer-motion";

export default function SkeletonLoader({ className = "", count = 1 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`skeleton rounded-xl h-4 ${className}`} />
      ))}
    </div>
  );
}
