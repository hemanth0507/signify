import React from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/ui/CourseCard.jsx";
import Header from "../components/ui/Header.jsx";
import { COURSES, CATEGORIES } from "../data/mockData.js";

export default function CoursesPage() {
  return (
    <div className="section-padded py-10">
      <Header
        title="All Courses"
        subtitle="Explore our full library of Indian Sign Language courses"
      />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button className="px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-medium">
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className="px-4 py-2 rounded-xl bg-surface-100 text-txt-muted text-xs font-medium hover:bg-surface-200 transition-colors"
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {COURSES.map((course, i) => (
          <CourseCard key={course.id} course={course} index={i} />
        ))}
      </div>
    </div>
  );
}
