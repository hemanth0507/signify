import React from "react";
import { motion } from "framer-motion";

export default function GradientButton({
  children,
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) {
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variants = {
    primary: "btn-gradient",
    outline:
      "border-2 border-purple-300 text-purple-700 bg-transparent hover:bg-purple-50 rounded-xl font-semibold transition-all",
    ghost:
      "text-purple-600 hover:bg-purple-50 rounded-xl font-semibold transition-all",
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
