from typing import List, Dict, Optional, Tuple
import re

from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled

from config import settings
from sign_utils import text_to_sign_sequence
from text_preprocess import process_for_sign_language
from audio_transcript import download_and_transcribe


MAX_TRANSCRIPT_LENGTH = 4000

TRANSCRIPT_SOURCE_CAPTIONS = "captions"
TRANSCRIPT_SOURCE_AUDIO = "audio"


# --------------------------------------------------
# Extract Video ID
# --------------------------------------------------

def _video_id_from_url(url: str) -> Optional[str]:
    if not url:
        return None

    url = url.strip()

    m = re.search(r"youtu\.be/([a-zA-Z0-9_-]{11})", url)
    if m:
        return m.group(1)

    m = re.search(r"[?&]v=([a-zA-Z0-9_-]{11})", url)
    if m:
        return m.group(1)

    if re.match(r"^[a-zA-Z0-9_-]{11}$", url):
        return url

    return None


# --------------------------------------------------
# YouTube Search
# --------------------------------------------------

def youtube_search(query: str, max_results: int = 5) -> List[Dict]:

    if not settings.YOUTUBE_API_KEY:
        raise RuntimeError("YOUTUBE_API_KEY not configured.")

    youtube = build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)

    request = youtube.search().list(
        q=query,
        part="snippet",
        type="video",
        maxResults=max_results,
        safeSearch="moderate",
    )

    response = request.execute()

    videos: List[Dict] = []

    for item in response.get("items", []):
        videos.append({
            "video_id": item["id"]["videoId"],
            "title": item["snippet"]["title"],
            "description": item["snippet"]["description"],
            "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
        })

    return videos


# --------------------------------------------------
# Captions
# --------------------------------------------------

def get_video_transcript(video_id: str, language_code: str = "en") -> Optional[str]:
    try:
        entries = YouTubeTranscriptApi.get_transcript(
            video_id,
            languages=[language_code, "en"]
        )

        full_text = " ".join(
            e["text"] for e in entries if e.get("text")
        ).strip()

        if len(full_text) > MAX_TRANSCRIPT_LENGTH:
            full_text = full_text[:MAX_TRANSCRIPT_LENGTH]

        return full_text

    except TranscriptsDisabled:
        return None
    except Exception:
        return None


# --------------------------------------------------
# Fallback (Captions → Audio)
# --------------------------------------------------

def get_video_transcript_with_fallback(
    video_id: str,
    language_code: str = "en"
) -> Tuple[Optional[str], str]:

    # 1️⃣ Try captions first
    text = get_video_transcript(video_id, language_code)

    if text:
        return text, TRANSCRIPT_SOURCE_CAPTIONS

    # 2️⃣ Try audio fallback
    if settings.ENABLE_AUDIO_FALLBACK:

        audio_text, ok = download_and_transcribe(video_id, language_code)

        if ok:

            if audio_text == "":
                # No speech detected
                return "", TRANSCRIPT_SOURCE_AUDIO

            if audio_text:
                if len(audio_text) > MAX_TRANSCRIPT_LENGTH:
                    audio_text = audio_text[:MAX_TRANSCRIPT_LENGTH]

                return audio_text.strip(), TRANSCRIPT_SOURCE_AUDIO

    return None, TRANSCRIPT_SOURCE_CAPTIONS


# --------------------------------------------------
# API Helpers
# --------------------------------------------------

def get_transcript_and_cleaned(video_id: str, language_code: str = "en") -> Dict:

    raw, source = get_video_transcript_with_fallback(video_id, language_code)

    if raw is None:
        return {
            "video_id": video_id,
            "transcript": None,
            "transcript_raw": None,
            "transcript_cleaned": None,
            "transcript_source": source,
            "error": "Transcript could not be extracted.",
        }

    if raw == "":
        return {
            "video_id": video_id,
            "transcript": "",
            "transcript_raw": "",
            "transcript_cleaned": "",
            "transcript_source": source,
            "error": "No speech detected in video.",
        }

    cleaned = process_for_sign_language(raw)

    return {
        "video_id": video_id,
        "transcript": cleaned,
        "transcript_raw": raw,
        "transcript_cleaned": cleaned,
        "transcript_source": source,
    }


# --------------------------------------------------
# Convert Video → Sign
# --------------------------------------------------

def youtube_video_to_sign(video_id: str, language_code: str = "en") -> Dict:

    raw, source = get_video_transcript_with_fallback(video_id, language_code)

    if raw is None:
        return {
            "video_id": video_id,
            "transcript": None,
            "transcript_raw": None,
            "transcript_source": source,
            "sign_tokens": [],
            "error": "Transcript could not be extracted.",
        }

    if raw == "":
        return {
            "video_id": video_id,
            "transcript": "",
            "transcript_raw": "",
            "transcript_source": source,
            "sign_tokens": [],
            "error": "No speech detected in video.",
        }

    cleaned = process_for_sign_language(raw)

    tokens = text_to_sign_sequence(cleaned.lower())

    return {
        "video_id": video_id,
        "transcript": cleaned,
        "transcript_raw": raw,
        "transcript_source": source,
        "sign_tokens": tokens,
    }


# --------------------------------------------------
# URL → Sign
# --------------------------------------------------

def youtube_url_to_sign(url: str, language_code: str = "en") -> Dict:

    video_id = _video_id_from_url(url)

    if not video_id:
        return {
            "video_id": None,
            "transcript": None,
            "transcript_raw": None,
            "transcript_source": None,
            "sign_tokens": [],
            "error": "Invalid YouTube URL.",
        }

    return youtube_video_to_sign(video_id, language_code)


# --------------------------------------------------
# Search → First Video → Sign
# --------------------------------------------------

def youtube_to_sign(query: str, language_code: str = "en") -> Dict:

    videos = youtube_search(query)

    if not videos:
        return {
            "videos": [],
            "transcript": None,
            "transcript_source": None,
            "sign_tokens": [],
        }

    return {
        "videos": videos,
    }
