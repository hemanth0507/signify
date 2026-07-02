import React from "react";
import { motion } from "framer-motion";

export default function CategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-5 text-center cursor-pointer group rounded-xl border border-white/5 hover:border-brand-400/30 hover:bg-white/10 transition-all duration-300"
    >
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
        {category.icon}
      </div>
      <h3 className="font-display font-semibold text-sm text-white mb-1 group-hover:text-brand-300 transition-colors">
        {category.name}
      </h3>
      <p className="text-xs text-txt-muted group-hover:text-white/80 transition-colors">
        {category.count} lessons
      </p>
    </motion.div>
  );
}
