import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-900 pt-16 pb-12 mt-20">
      <div className="container mx-auto px-6 text-center">
        
        <Link to="/" className="inline-block mb-10 group">
          <span className="text-4xl font-display font-bold text-white tracking-tight group-hover:scale-110 transition-transform block">
            signify
          </span>
        </Link>

        <div className="flex flex-wrap justify-center gap-8 mb-12 font-bold text-brand-200">
           <Link to="/about" className="hover:text-white transition-colors">ABOUT</Link>
           <Link to="/courses" className="hover:text-white transition-colors">COURSES</Link>
           <Link to="/tools" className="hover:text-white transition-colors">TOOLS</Link>
           <Link to="/schools" className="hover:text-white transition-colors">FOR SCHOOLS</Link>
           <Link to="/contact" className="hover:text-white transition-colors">CONTACT</Link>
        </div>

        <div className="flex justify-center gap-6 mb-12">
          {[Github, Twitter, Instagram].map((Icon, i) => (
            <a key={i} href="#" className="text-brand-300 hover:text-white transition-colors">
              <Icon size={24} />
            </a>
          ))}
        </div>

        <div className="border-t border-brand-800 pt-8 text-brand-400 text-sm font-medium">
          <p>© {new Date().getFullYear()} Signify Education. Learn freely.</p>
        </div>
      </div>
    </footer>
  );
}
