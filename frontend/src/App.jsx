import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/ui/Navbar.jsx";
import Footer from "./components/ui/Footer.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import TextToSignPage from "./pages/TextToSignPage.jsx";
import YoutubeToSignPage from "./pages/YoutubeToSignPage.jsx";
import UploadLecturePage from "./pages/UploadLecturePage.jsx";
import ChatbotPage from "./pages/ChatbotPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  /* Auth pages get their own full‑screen layout */
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen font-body flex flex-col bg-surface text-txt-primary selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-grow pt-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/tools/text-to-sign" element={<TextToSignPage />} />
          <Route path="/tools/youtube-to-sign" element={<YoutubeToSignPage />} />
          <Route path="/tools/upload-lecture" element={<UploadLecturePage />} />
          <Route path="/tools/chatbot" element={<ChatbotPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
