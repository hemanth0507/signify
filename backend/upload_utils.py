"""
Upload Lecture processing pipeline:
  Video file → ffmpeg audio extraction → Whisper transcription → Text preprocessing → ISL sign tokens
"""

import os
import uuid
import subprocess
from typing import Dict

from fastapi import UploadFile, HTTPException

from config import settings
from sign_utils import text_to_sign_sequence
from text_preprocess import process_for_sign_language
from audio_transcript import transcribe_audio


# Allowed video extensions
ALLOWED_EXTENSIONS = {".mp4", ".mov", ".webm"}
MAX_FILE_SIZE_MB = 200


def _validate_file(file: UploadFile) -> None:
    """Validate uploaded file format."""
    filename = file.filename or ""
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )


def save_uploaded_video(file: UploadFile) -> str:
    """Save uploaded video to disk and return the file path."""
    filename = file.filename or "lecture.mp4"
    safe_name = filename.replace("/", "_").replace("\\", "_")
    # Add unique prefix to avoid collisions
    unique_name = f"{uuid.uuid4().hex[:8]}_{safe_name}"
    dest_path = os.path.join(settings.UPLOAD_DIR, unique_name)

    total_bytes = 0
    max_bytes = MAX_FILE_SIZE_MB * 1024 * 1024

    with open(dest_path, "wb") as out_file:
        while chunk := file.file.read(1024 * 1024):
            total_bytes += len(chunk)
            if total_bytes > max_bytes:
                out_file.close()
                os.remove(dest_path)
                raise HTTPException(
                    status_code=400,
                    detail=f"File too large. Maximum allowed size is {MAX_FILE_SIZE_MB}MB.",
                )
            out_file.write(chunk)

    return dest_path


def extract_audio(video_path: str) -> str:
    """
    Extract audio from video using ffmpeg.
    Returns path to the extracted .wav file.
    """
    audio_filename = f"{uuid.uuid4().hex}.wav"
    audio_path = os.path.join(settings.AUDIO_TEMP_DIR, audio_filename)
    os.makedirs(settings.AUDIO_TEMP_DIR, exist_ok=True)

    cmd = [
        "ffmpeg",
        "-i", video_path,
        "-vn",                  # no video
        "-acodec", "pcm_s16le", # WAV format
        "-ar", "16000",         # 16kHz for Whisper
        "-ac", "1",             # mono
        "-y",                   # overwrite
        audio_path,
    ]

    try:
        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=300,  # 5-minute timeout
        )
        if result.returncode != 0:
            stderr_text = result.stderr.decode("utf-8", errors="replace")
            print(f"FFmpeg error: {stderr_text}")
            raise HTTPException(
                status_code=500,
                detail="Failed to extract audio from video. Please ensure the video contains an audio track.",
            )
    except FileNotFoundError:
        raise HTTPException(
            status_code=500,
            detail="FFmpeg is not installed or not found in PATH. Please install FFmpeg.",
        )
    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=500,
            detail="Audio extraction timed out. Please try a shorter video.",
        )

    if not os.path.exists(audio_path) or os.path.getsize(audio_path) == 0:
        raise HTTPException(
            status_code=500,
            detail="Audio extraction produced no output. The video may not contain audio.",
        )

    return audio_path


def process_uploaded_lecture(file: UploadFile) -> Dict:
    """
    Full pipeline:
      1. Validate file format
      2. Save video to disk
      3. Extract audio via ffmpeg
      4. Transcribe audio via Whisper
      5. Preprocess transcript for sign language
      6. Convert to ISL sign tokens
    """
    _validate_file(file)

    video_path = save_uploaded_video(file)
    audio_path = None

    try:
        # Step: Extract audio
        audio_path = extract_audio(video_path)

        # Step: Transcribe with Whisper
        raw_transcript = transcribe_audio(audio_path, language="en")

        if raw_transcript is None:
            raise HTTPException(
                status_code=500,
                detail="Whisper model failed to transcribe. Please try again.",
            )

        if not raw_transcript.strip():
            raise HTTPException(
                status_code=422,
                detail="No speech detected in the uploaded video.",
            )

        # Step: Preprocess for sign language
        cleaned_transcript = process_for_sign_language(raw_transcript)

        # Step: Convert to sign tokens
        sign_tokens = text_to_sign_sequence(cleaned_transcript.lower())

        return {
            "file_name": file.filename,
            "transcript": cleaned_transcript,
            "raw_transcript": raw_transcript,
            "sign_tokens": sign_tokens,
        }

    finally:
        # Cleanup temp audio
        if audio_path and os.path.exists(audio_path):
            try:
                os.remove(audio_path)
            except Exception:
                pass
