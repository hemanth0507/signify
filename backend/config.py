import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = "Signify Backend"
    APP_VERSION: str = "0.1.0"

    # Paths
    BASE_DIR: str = os.path.dirname(os.path.abspath(__file__))
    SIGN_DATA_DIR: str = os.path.join(BASE_DIR, "sign_data")
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "uploads")
    AUDIO_TEMP_DIR: str = os.path.join(BASE_DIR, "temp_audio")

    # External APIs
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")
    YOUTUBE_API_KEY: str | None = os.getenv("YOUTUBE_API_KEY")

    # Optional audio fallback (speech-to-text) when captions are missing
    ENABLE_AUDIO_FALLBACK: bool = os.getenv("ENABLE_AUDIO_FALLBACK", "true").lower() in (
        "1",
        "true",
        "yes",
        "on",
    )
    WHISPER_MODEL: str = os.getenv("WHISPER_MODEL", "base")

    # Local dev: allow insecure SSL for YouTube/yt-dlp in restricted networks
    INSECURE_SSL: bool = os.getenv("INSECURE_SSL", "false").lower() in (
        "1",
        "true",
        "yes",
        "on",
    )

    # SSL settings for YouTube access (useful behind corporate proxies)
    _RAW_YT_SSL_VERIFY: str | None = os.getenv("YOUTUBE_SSL_VERIFY")
    if _RAW_YT_SSL_VERIFY is None:
        YOUTUBE_SSL_VERIFY: bool = not INSECURE_SSL
    else:
        YOUTUBE_SSL_VERIFY: bool = _RAW_YT_SSL_VERIFY.lower() in (
            "1",
            "true",
            "yes",
            "on",
        )
    YOUTUBE_CA_BUNDLE: str | None = os.getenv("YOUTUBE_CA_BUNDLE")

    # yt-dlp options
    YTDLP_JS_RUNTIMES: str | None = os.getenv("YTDLP_JS_RUNTIMES")
    YTDLP_COOKIES: str | None = os.getenv("YTDLP_COOKIES")
    YTDLP_REMOTE_COMPONENTS: str | None = os.getenv("YTDLP_REMOTE_COMPONENTS")
    YTDLP_COOKIES_FROM_BROWSER: str | None = os.getenv("YTDLP_COOKIES_FROM_BROWSER")


settings = Settings()

# Ensure folders exist
os.makedirs(settings.SIGN_DATA_DIR, exist_ok=True)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.AUDIO_TEMP_DIR, exist_ok=True)

