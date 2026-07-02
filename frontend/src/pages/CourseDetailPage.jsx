import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Users, Clock, BookOpen, PlayCircle, CheckCircle, ArrowLeft } from "lucide-react";
import GlassCard from "../components/ui/GlassCard.jsx";
import StarRating from "../components/ui/StarRating.jsx";
import { getCourseById, CURRICULUM } from "../data/mockData.js";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const course = getCourseById(courseId);

  if (!course) {
    return (
      <div className="section-padded py-20 text-center">
        <h1 className="text-2xl font-display font-bold text-txt-primary mb-4">Course Not Found</h1>
        <Link to="/courses" className="btn-primary">Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="section-padded py-10 text-white">
      {/* Breadcrumb */}
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-txt-secondary hover:text-brand-300 mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="h-56 sm:h-72 rounded-2xl bg-gradient-to-br from-brand-800 to-indigo-900 flex items-center justify-center mb-6 border border-white/10 relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <span className="text-6xl opacity-80 filter drop-shadow-lg">🤟</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-lg bg-brand-500/20 border border-brand-500/30 text-brand-200 text-xs font-medium">{course.level}</span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium">{course.price}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              {course.title}
            </h1>

            <p className="text-base text-txt-secondary leading-relaxed mb-6">
              {course.description}
            </p>

            <div className="flex items-center gap-6 text-sm text-txt-muted border-t border-white/10 pt-6">
              <span className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  <StarRating rating={course.rating} size={16} />
                </div>
                <span className="font-bold text-white ml-2">{course.rating}</span>
                <span>({course.reviews?.toLocaleString()} reviews)</span>
              </span>
              <span className="flex items-center gap-2"><Users size={16} /> {course.students?.toLocaleString()} students</span>
            </div>
          </motion.div>

          {/* Curriculum */}
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-6">Course Curriculum</h2>
            <div className="space-y-4">
              {CURRICULUM.map((module, mi) => (
                <div key={module.id} className="glass-panel p-6 rounded-2xl border border-white/5">
                  <h3 className="font-display font-bold text-lg text-white mb-4">
                    Module {mi + 1}: {module.title}
                  </h3>
                  <div className="space-y-3">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        {lesson.completed ? (
                          <CheckCircle size={20} className="text-emerald-400" />
                        ) : (
                          <PlayCircle size={20} className="text-brand-400 group-hover:text-brand-300 transition-colors" />
                        )}
                        <span className={`flex-1 text-sm font-medium ${lesson.completed ? "text-txt-muted line-through" : "text-txt-primary group-hover:text-white"}`}>
                          {lesson.title}
                        </span>
                        <span className="text-xs text-txt-muted">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 sticky top-24">
            <h3 className="font-display font-bold text-xl text-white mb-6">Course Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-txt-secondary">Instructor</span>
                <span className="font-bold text-white">{course.instructor}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-txt-secondary">Duration</span>
                <span className="font-bold text-white">{course.duration}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-txt-secondary">Lessons</span>
                <span className="font-bold text-white">{course.lessons}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-txt-secondary">Level</span>
                <span className="font-bold text-white">{course.level}</span>
              </div>
            </div>

            <div className="mt-8">
              <button className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg">
                <BookOpen size={20} /> Enroll Now
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h4 className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {course.tags?.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-txt-secondary text-xs hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
