import React from "react";
import { Link } from "react-router-dom";
import { PlayCircle, Star, Trophy, Target, ArrowRight, Zap, MessageSquare, Layers, Layout, Lock, Globe, Type, Video, Play } from "lucide-react";
import TypewriterEffect from "../components/ui/TypewriterEffect.jsx";
import FeatureCard from "../components/ui/FeatureCard.jsx";
import CourseCard from "../components/ui/CourseCard.jsx";
import { COURSES } from "../data/mockData.js";
import AnimatedBackground from "../components/ui/AnimatedBackground.jsx";

// Mock Data
const FEATURES = [
  { icon: Layers, title: "Structured Learning", desc: "Curriculum designed by experts for progressive learning." },
  { icon: Layout, title: "Interactive Tools", desc: "Real-time AI feedback on your signing accuracy." },
  { icon: Globe, title: "Accessible Anywhere", desc: "Learn from any device, anytime, with offline support." },
  { icon: Lock, title: "Secure & Private", desc: "Your data and learning progress are always protected." },
];

const TOOLS = [
  { icon: Type, title: "Text to Sign", desc: "Convert text to ISL animation.", to: "/tools/text-to-sign" },
  { icon: Video, title: "YouTube to Sign", desc: "Watch videos with signs.", to: "/tools/youtube-to-sign" },
  { icon: Play, title: "Upload Lecture", desc: "Get signs for your lectures.", to: "/tools/upload-lecture" },
  { icon: MessageSquare, title: "AI Chatbot", desc: "Chat and practice ISL.", to: "/tools/chatbot" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface overflow-x-hidden pt-20">
      <AnimatedBackground />

      {/* Hero: Learning Dashboard Header */}
      <section className="container mx-auto px-6 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-full border border-brand-100 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-sm font-bold text-brand-600 tracking-wide uppercase">
                AI-Powered Learning
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold text-txt-primary leading-tight">
              Start Your <span className="text-brand-500">ISL Journey</span> Today.
            </h1>
            
            <p className="text-lg lg:text-xl text-txt-secondary max-w-lg leading-relaxed">
              Master Indian Sign Language with interactive lessons, real-time AI feedback, and a supportive community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/courses" className="btn-primary flex items-center justify-center gap-3 group">
                 Start Learning <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/tools" className="btn-secondary flex items-center justify-center gap-3">
                 Explore Tools
              </Link>
            </div>
            
            <div className="flex items-center gap-6 pt-4 text-sm font-bold text-txt-secondary">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200`} />
                ))}
              </div>
              <p>Join 10,000+ learners</p>
            </div>
          </div>

          {/* Hero Illustration / Dashboard Preview */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-brand-500/5 blur-[100px] rounded-full" />
             {/* Abstract Illustration Placeholder */}
             <div className="relative z-10 w-full aspect-square max-w-md mx-auto">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-yellow/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-500/10 rounded-full blur-xl" />
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3048/3048122.png" 
                  alt="Learning Illustration" 
                  className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Learning Pathways */}
      <section className="py-16 bg-white border-y-2 border-surface-muted">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-txt-primary mb-2">Learning Pathways</h2>
              <p className="text-txt-secondary">Structured courses to take you from beginner to pro.</p>
            </div>
            <Link to="/courses" className="text-brand-500 font-bold hover:underline">View All</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Beginner */}
            <div className="card-hover group">
               <div className="h-32 bg-brand-100 rounded-2xl mb-6 flex items-center justify-center text-6xl">
                 🌱
               </div>
               <h3 className="text-xl font-bold mb-2">Beginner</h3>
               <p className="text-txt-secondary text-sm mb-4">Start here! Learn the alphabet, numbers, and basic greetings.</p>
               <div className="progress-container mb-4">
                 <div className="progress-bar w-[0%] group-hover:w-[15%]" />
               </div>
               <button className="btn-outline w-full py-2 !rounded-xl !text-sm">Start Level 1</button>
            </div>

             {/* Intermediate */}
             <div className="card-hover group">
               <div className="h-32 bg-brand-50 rounded-2xl mb-6 flex items-center justify-center text-6xl">
                 🚀
               </div>
               <h3 className="text-xl font-bold mb-2">Intermediate</h3>
               <p className="text-txt-secondary text-sm mb-4">Build simple sentences and expand your vocabulary.</p>
               <div className="progress-container mb-4">
                 <div className="progress-bar w-0" />
               </div>
               <button className="btn-secondary w-full py-2 !rounded-xl !text-sm text-txt-muted cursor-not-allowed">Locked</button>
            </div>

             {/* Advanced */}
             <div className="card-hover group">
               <div className="h-32 bg-accent-yellow/10 rounded-2xl mb-6 flex items-center justify-center text-6xl">
                 🏆
               </div>
               <h3 className="text-xl font-bold mb-2">Advanced</h3>
               <p className="text-txt-secondary text-sm mb-4">Fluent conversation and complex grammatical structures.</p>
               <div className="progress-container mb-4">
                 <div className="progress-bar w-0" />
               </div>
               <button className="btn-secondary w-full py-2 !rounded-xl !text-sm text-txt-muted cursor-not-allowed">Locked</button>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Progress & Stats */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-base flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-accent-yellow/20 text-accent-yellow flex items-center justify-center">
                    <Zap size={24} fill="currentColor" />
                 </div>
                 <div>
                    <div className="text-2xl font-bold">3 Days</div>
                    <div className="text-xs font-bold text-txt-muted uppercase">Current Streak</div>
                 </div>
              </div>

              <div className="card-base flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-accent-green/20 text-accent-green flex items-center justify-center">
                    <Target size={24} />
                 </div>
                 <div>
                    <div className="text-2xl font-bold">12/50 XP</div>
                    <div className="text-xs font-bold text-txt-muted uppercase">Daily Goal</div>
                 </div>
              </div>

              <div className="card-base flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-500 flex items-center justify-center">
                    <Trophy size={24} />
                 </div>
                 <div>
                    <div className="text-2xl font-bold">Level 1</div>
                    <div className="text-xs font-bold text-txt-muted uppercase">Current Rank</div>
                 </div>
              </div>

              <div className="card-base flex items-center gap-4 bg-brand-500 text-white border-brand-500">
                 <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center">
                    <Star size={24} fill="currentColor" />
                 </div>
                 <div>
                    <div className="text-xl font-bold">Go Premium</div>
                    <div className="text-xs font-semibold opacity-80 uppercase">Unlock all features</div>
                 </div>
              </div>
           </div>
        </div>
      </section>
      
      {/* Tools Section */}
      <section className="py-16 bg-white border-t-2 border-surface-muted">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-txt-primary mb-2">Practice Tools</h2>
              <p className="text-txt-secondary">AI-powered tools for mastery.</p>
            </div>
            <Link to="/tools" className="text-accent-green font-bold hover:underline">View All</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOOLS.map((tool, i) => (
              <Link key={i} to={tool.to} className="group">
                <div className="card-hover h-full flex flex-col items-center text-center p-8">
                   <div className="mb-6 text-brand-500 group-hover:scale-110 transition-transform bg-brand-50 p-4 rounded-2xl">
                     <tool.icon size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-txt-primary mb-2">{tool.title}</h3>
                   <p className="text-txt-secondary text-sm mb-4">
                     {tool.desc}
                   </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-500 py-20 text-center">
         <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to start your journey?</h2>
            <Link to="/signup" className="inline-block bg-white text-brand-900 font-bold py-4 px-10 rounded-2xl shadow-xl hover:bg-brand-50 hover:scale-105 transition-all">
               Create Free Account
            </Link>
         </div>
      </section>

    </div>
  );
}
