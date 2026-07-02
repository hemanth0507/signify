import React from "react";
import Header from "../components/ui/Header.jsx";
import Chatbot from "../components/Chatbot.jsx";

export default function ChatbotPage() {
  return (
    <div className="section-padded py-10">
      <Header
        title="AI Sign Language Chatbot"
        subtitle="Ask questions and get answers in ISL"
      />
      <Chatbot />
    </div>
  );
}
