import React from "react";
import Header from "../components/ui/Header.jsx";
import UploadLecture from "../components/UploadLecture.jsx";

export default function UploadLecturePage() {
  return (
    <div className="section-padded py-10">
      <Header
        title="Upload Lecture"
        subtitle="Upload a video lecture and translate it to ISL"
      />
      <UploadLecture />
    </div>
  );
}
