import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, BookOpen } from "lucide-react";
import GlassCard from "../components/ui/GlassCard.jsx";
import { getCourseById, CURRICULUM } from "../data/mockData.js";

export default function LearningPlayerPage() {
  const { courseId } = useParams();
  const course = getCourseById(courseId);

  if (!course) {
    return (
      <div className="section-padded py-20 text-center">
        <h1 className="text-2xl font-display font-bold text-txt-primary mb-4">Course Not Found</h1>
        <Link to="/courses" className="btn-gradient">Back to Courses</Link>
      </div>
    );
  }

  const currentLesson = CURRICULUM[0]?.lessons[2]; // Example: current lesson

  return (
    <div className="section-padded py-6">
      <Link to={`/courses/${courseId}`} className="inline-flex items-center gap-1.5 text-sm text-txt-muted hover:text-brand-500 mb-4 transition-colors">
        <ArrowLeft size={14} /> Back to Course
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden bg-surface-100 border border-surface-200 aspect-video flex items-center justify-center mb-4">
            <div className="text-center">
              <Play size={48} className="text-brand-300 mx-auto mb-3" />
              <p className="text-sm text-txt-muted">Video player placeholder</p>
              <p className="text-xs text-txt-light mt-1">{currentLesson?.title || "No lesson selected"}</p>
            </div>
          </div>
          <h2 className="font-display text-lg font-bold text-txt-primary mb-2">
            {currentLesson?.title || course.title}
          </h2>
          <p className="text-sm text-txt-muted">{course.instructor} · {currentLesson?.duration || course.duration}</p>
        </div>

        {/* Sidebar: Lesson List */}
        <div>
          <GlassCard className="p-4" hover={false}>
            <h3 className="font-display font-semibold text-sm text-txt-primary mb-3 flex items-center gap-2">
              <BookOpen size={16} className="text-brand-500" /> Course Content
            </h3>
            <div className="space-y-1 max-h-[60vh] overflow-y-auto">
              {CURRICULUM.map((module) =>
                module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-sm cursor-pointer transition-colors ${
                      lesson.id === currentLesson?.id
                        ? "bg-brand-50 text-brand-600 font-medium"
                        : "text-txt-muted hover:bg-surface-50"
                    }`}
                  >
                    <Play size={12} />
                    <span className="flex-1 truncate">{lesson.title}</span>
                    <span className="text-xs text-txt-light">{lesson.duration}</span>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
