from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, Any

from config import settings
from sign_utils import text_to_sign_sequence
from chatbot import chat_with_gemini
from youtube_utils import (
    youtube_to_sign,
    youtube_url_to_sign,
    youtube_video_to_sign,
    get_transcript_and_cleaned,
)
from upload_utils import process_uploaded_lecture


class TextRequest(BaseModel):
    text: str


class ChatRequest(BaseModel):
    message: str


class YoutubeRequest(BaseModel):
    query: str


class YoutubeUrlRequest(BaseModel):
    url: str


class YoutubeVideoRequest(BaseModel):
    video_id: str


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/sign_data",
    StaticFiles(directory=settings.SIGN_DATA_DIR),
    name="sign_data",
)

app.mount(
    "/uploads",
    StaticFiles(directory=settings.UPLOAD_DIR),
    name="uploads",
)


@app.get("/api/health")
def health() -> Dict[str, Any]:
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.APP_VERSION}


@app.post("/api/text-to-sign")
def text_to_sign_endpoint(req: TextRequest) -> Dict[str, Any]:
    tokens = text_to_sign_sequence(req.text)
    return {"text": req.text, "tokens": tokens}


@app.post("/api/chat")
def chat_endpoint(req: ChatRequest) -> Dict[str, Any]:
    try:
        result = chat_with_gemini(req.message)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    return result


@app.post("/api/get-transcript")
def get_transcript_endpoint(req: YoutubeVideoRequest) -> Dict[str, Any]:
    """
    Get transcript for a YouTube video (by video_id).
    Browser can send current video ID → backend returns transcript (raw + cleaned).
    """
    try:
        return get_transcript_and_cleaned(req.video_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/youtube-to-sign")
def youtube_to_sign_endpoint(req: YoutubeRequest) -> Dict[str, Any]:
    try:
        result = youtube_to_sign(req.query)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    return result


@app.post("/api/youtube-video-to-sign")
def youtube_video_to_sign_endpoint(req: YoutubeVideoRequest) -> Dict[str, Any]:
    try:
        result = youtube_video_to_sign(req.video_id)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    return result


@app.post("/api/youtube-url-to-sign")
def youtube_url_to_sign_endpoint(req: YoutubeUrlRequest) -> Dict[str, Any]:
    try:
        result = youtube_url_to_sign(req.url)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    return result


@app.post("/api/upload-lecture")
async def upload_lecture_endpoint(file: UploadFile = File(...)) -> Dict[str, Any]:
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    result = process_uploaded_lecture(file)
    return result

