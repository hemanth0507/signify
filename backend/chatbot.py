from typing import Dict, Any

import google.generativeai as genai

from config import settings
from sign_utils import text_to_sign_sequence


SYSTEM_PROMPT = (
    "You are Signify, an AI tutor for deaf and mute engineering students in India. "
    "Always explain concepts in simple, clear English suitable for beginners. "
    "Prefer short sentences and avoid jargon where possible. "
    "Do not use emojis or Markdown. Reply in plain text."
)


def get_gemini_model() -> Any:
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured in environment variables.")

    genai.configure(api_key=settings.GEMINI_API_KEY)
    return genai.GenerativeModel("gemini-2.5-flash")


def chat_with_gemini(user_message: str) -> Dict:
    model = get_gemini_model()
    prompt = SYSTEM_PROMPT + "\n\nUser question:\n" + user_message
    response = model.generate_content(prompt)
    answer = (response.text or "").strip()
    sign_tokens = text_to_sign_sequence(answer.lower())
    return {
        "answer": answer,
        "sign_tokens": sign_tokens,
    }

