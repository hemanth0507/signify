import React from "react";
import { Star } from "lucide-react";

export default function StarRating({ rating, max = 5, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.floor(rating)
              ? "text-amber-400 fill-amber-400"
              : i < rating
              ? "text-amber-400 fill-amber-200"
              : "text-surface-300"
          }
        />
      ))}
    </div>
  );
}
