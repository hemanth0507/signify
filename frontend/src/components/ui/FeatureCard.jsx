import React from "react";
import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, desc, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-8 rounded-3xl border border-surface-muted hover:border-brand-200 hover:shadow-card-hover transition-all duration-300 group"
    >
      <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500 mb-6 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
        <Icon size={28} />
      </div>
      
      <h3 className="font-bold text-xl text-txt-primary mb-3 group-hover:text-brand-600 transition-colors">
        {title}
      </h3>
      
      <p className="text-txt-secondary leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}
