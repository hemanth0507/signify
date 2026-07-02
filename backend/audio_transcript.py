"""
Audio fallback:
YouTube → yt-dlp → faster-whisper → Transcript
Stable production version.
"""

import os
import uuid
from typing import Optional, Tuple

import yt_dlp
from faster_whisper import WhisperModel
from config import settings


print("Loading Whisper model...")

MODEL_NAME = settings.WHISPER_MODEL or "base"

try:
    whisper_model = WhisperModel(
        MODEL_NAME,
        device="cpu",
        compute_type="int8",
    )
    print(f"Whisper model '{MODEL_NAME}' loaded successfully.")
except Exception as e:
    print("Whisper model load error:", e)
    whisper_model = None


# --------------------------------------------------
# Download audio
# --------------------------------------------------

def download_audio(video_id: str) -> Optional[str]:

    try:
        os.makedirs(settings.AUDIO_TEMP_DIR, exist_ok=True)

        unique_name = f"{video_id}_{uuid.uuid4().hex}"
        output_template = os.path.join(
            settings.AUDIO_TEMP_DIR,
            f"{unique_name}.%(ext)s"
        )

        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": output_template,
            "quiet": True,
            "no_warnings": True,
            "postprocessors": [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "128",
                }
            ],
        }

        url = f"https://www.youtube.com/watch?v={video_id}"

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        for file in os.listdir(settings.AUDIO_TEMP_DIR):
            if unique_name in file and file.endswith(".mp3"):
                return os.path.join(settings.AUDIO_TEMP_DIR, file)

        return None

    except Exception as e:
        print("DOWNLOAD ERROR:", e)
        return None


# --------------------------------------------------
# Transcribe
# --------------------------------------------------

def transcribe_audio(audio_path: str, language: str = "en") -> Optional[str]:

    if not whisper_model:
        print("Whisper model not loaded.")
        return None

    if not os.path.exists(audio_path):
        print("Audio file not found.")
        return None

    try:
        segments, info = whisper_model.transcribe(
            audio_path,
            language=language,
            beam_size=5
        )

        full_text = ""
        for segment in segments:
            full_text += segment.text + " "

        final_text = full_text.strip()

        # IMPORTANT CHANGE:
        # If no speech detected, return empty string, not None
        if not final_text:
            print("No speech detected in audio.")
            return ""

        return final_text

    except Exception as e:
        print("WHISPER ERROR:", e)
        return None


# --------------------------------------------------
# Pipeline
# --------------------------------------------------

def download_and_transcribe(
    video_id: str,
    language: str = "en"
) -> Tuple[Optional[str], bool]:

    audio_path = download_audio(video_id)

    if not audio_path:
        return None, False

    try:
        text = transcribe_audio(audio_path, language)

        if text is None:
            return None, False

        return text, True

    finally:
        try:
            if os.path.exists(audio_path):
                os.remove(audio_path)
        except Exception:
            pass
