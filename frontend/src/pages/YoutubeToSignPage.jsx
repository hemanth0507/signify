import React from "react";
import Header from "../components/ui/Header.jsx";
import YoutubeToSign from "../components/YoutubeToSign.jsx";

export default function YoutubeToSignPage() {
  return (
    <div className="section-padded py-10">
      <Header
        title="YouTube to Sign Language"
        subtitle="Search YouTube videos and convert them to ISL"
      />
      <YoutubeToSign />
    </div>
  );
}
