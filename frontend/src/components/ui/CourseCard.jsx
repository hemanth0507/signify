import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, Trophy, PlayCircle } from "lucide-react";

export default function CourseCard({ course, index = 0 }) {
  // Mock progress for demo feel
  const progress = Math.floor(Math.random() * 80) + 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/courses/${course.id}`} className="block group h-full">
        <div className="card-hover h-full flex flex-col p-0 overflow-hidden relative border-b-4 border-surface-muted hover:border-brand-200">
          
          {/* Top Half: Visual */}
          <div className="h-32 bg-brand-50 flex items-center justify-between px-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full translate-x-10 -translate-y-10" />
             <div className="relative z-10">
                <span className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-1 block">Level</span>
                <span className="px-3 py-1 bg-white rounded-full text-brand-600 text-xs font-bold shadow-sm inline-block">
                  {course.level}
                </span>
             </div>
             <span className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                {course.thumbnail || "🎓"}
             </span>
          </div>

          {/* Bottom Half: Content */}
          <div className="p-6 flex flex-col flex-1">
            <h3 className="font-bold text-lg text-txt-primary leading-tight mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
              {course.title}
            </h3>
            
            <div className="flex items-center gap-4 text-xs text-txt-secondary mb-4">
               <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
               <span className="flex items-center gap-1"><Star size={14} className="text-accent-yellow fill-current" /> {course.rating}</span>
            </div>

            {/* Progress Bar Mock */}
            <div className="mt-auto">
               <div className="flex justify-between text-xs font-bold text-txt-secondary mb-1">
                  <span>Progress</span>
                  <span>{progress}%</span>
               </div>
               <div className="progress-container h-2">
                  <div className="progress-bar" style={{ width: `${progress}%` }} />
               </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-surface-muted flex justify-between items-center text-xs font-bold text-brand-500 uppercase tracking-wide group-hover:text-brand-600">
               <span>Continue Lesson</span>
               <PlayCircle size={16} className="fill-current" />
            </div>

          </div>
        </div>
      </Link>
    </motion.div>
  );
}
