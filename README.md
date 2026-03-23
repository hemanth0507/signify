# Signify - YouTube Video ID Auto-Capture

## Core Idea
Detect the currently playing YouTube video in the browser, extract the video ID,
send it to the Python backend, and then extract the transcript.

## High-Level Architecture
User plays YouTube video (Browser)
-> Browser detects video URL / ID
-> Send video ID to Python backend
-> Python extracts transcript

## Method 1: Browser Extension (Best and Realistic)
- A Chrome Extension or browser script runs in the browser
- It reads the current YouTube URL
- Extracts the `video_id`
- Sends it to Python using an API (Flask / FastAPI)

### JavaScript (Browser Side)
```javascript
function getVideoId() {
  const url = window.location.href;
  const videoId = new URL(url).searchParams.get("v");
  return videoId;
}

console.log(getVideoId());
```

### Send Video ID to Python Backend
```javascript
fetch("http://127.0.0.1:8000/get_transcript", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ video_id: getVideoId() })
});
```

## Python Backend (FastAPI Example)
```bash
pip install fastapi uvicorn youtube-transcript-api
```

```python
from fastapi import FastAPI
from youtube_transcript_api import YouTubeTranscriptApi

app = FastAPI()

@app.post("/get_transcript")
def get_transcript(data: dict):
  video_id = data["video_id"]
  transcript = YouTubeTranscriptApi.get_transcript(video_id)
  full_text = " ".join([item["text"] for item in transcript])
  return {"transcript": full_text}
```

```bash
uvicorn main:app --reload
```

## Method 2: YouTube URL Input (Simpler Demo)
```python
def get_video_id(url):
  return url.split("v=")[1].split("&")[0]

url = input("Enter YouTube URL: ")
video_id = get_video_id(url)
text = extract_transcript(video_id)
print(text)
```

## How to Explain This
"When a user plays any YouTube video, the browser automatically captures the
video ID from the URL. This video ID is sent to our Python backend, where we
extract the transcript in real time and convert it into sign language."

## One-Line Answer
"We automatically detect the currently playing YouTube video by extracting the
video ID from the browser URL and passing it to our backend for processing."

## Troubleshooting (YouTube Transcript / Audio)
- If you see SSL certificate errors, set `INSECURE_SSL=true` in your environment
  (or install the correct root certificate for your network).
- If captions are missing, audio fallback requires `yt-dlp` and a whisper model
  (`faster-whisper` or `openai-whisper`).
