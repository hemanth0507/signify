import React from "react";
import Header from "../components/ui/Header.jsx";
import TextToSign from "../components/TextToSign.jsx";

export default function TextToSignPage() {
  return (
    <div className="section-padded py-10">
      <Header
        title="Text to Sign Language"
        subtitle="Convert any text into Indian Sign Language"
      />
      <TextToSign />
    </div>
  );
}
