import os
from typing import List, Dict, Optional

from config import settings

_SIGN_INDEX: Dict[str, str] = {}

# --------------------------------------------------
# Helpers
# --------------------------------------------------

def _build_sign_index() -> Dict[str, str]:
    """
    Build a lowercase -> actual filename map for sign videos.
    This makes lookups case-insensitive and supports mixed-case filenames.
    """
    index: Dict[str, str] = {}
    if not os.path.isdir(settings.SIGN_DATA_DIR):
        return index

    for fname in os.listdir(settings.SIGN_DATA_DIR):
        if fname.lower().endswith(".mp4"):
            key = os.path.splitext(fname)[0].lower()
            index[key] = fname
    return index


def _get_sign_index() -> Dict[str, str]:
    global _SIGN_INDEX
    if not _SIGN_INDEX:
        _SIGN_INDEX = _build_sign_index()
    return _SIGN_INDEX


def list_available_signs() -> List[str]:
    """
    Returns available sign keys from sign_data folder.
    Example: ['a', 'b', 'hello']
    """
    return sorted(_get_sign_index().keys())


def word_to_sign_key(word: str) -> str:
    return word.strip().lower()


def get_sign_video_path(key: str) -> Optional[str]:
    """
    Returns relative path usable by frontend
    """
    if not key:
        return None

    normalized = key.strip().lower()
    index = _get_sign_index()
    filename = index.get(normalized)
    if not filename:
        # Refresh index in case new files were added
        global _SIGN_INDEX
        _SIGN_INDEX = _build_sign_index()
        filename = _SIGN_INDEX.get(normalized)
        if not filename:
            return None

    # frontend-safe path
    return f"/sign_data/{filename}"


# --------------------------------------------------
# MAIN FUNCTION
# --------------------------------------------------

def text_to_sign_sequence(text: str) -> List[Dict]:
    """
    Convert text into sign tokens.
    Priority:
      1. Word sign (if exists)
      2. Letter-wise fallback (a–z)
    """
    tokens: List[Dict] = []

    words = text.lower().split()

    for word in words:
        # ---- Try WORD sign first ----
        word_key = word_to_sign_key(word)
        word_video = get_sign_video_path(word_key)

        if word_video:
            tokens.append({
                "type": "word",
                "value": word,
                "video": word_video,
            })
        else:
            # ---- Letter fallback ----
            for ch in word:
                if not ch.isalpha():
                    continue

                ch_key = ch.lower()   # IMPORTANT: lowercase
                ch_video = get_sign_video_path(ch_key)

                tokens.append({
                    "type": "char",
                    "value": ch_key,
                    "video": ch_video,
                })

        # space between words
        tokens.append({
            "type": "space",
            "value": " ",
            "video": None,
        })

    return tokens


def tokens_to_video_paths(tokens: List[Dict]) -> List[str]:
    """
    Convert tokens with /sign_data/... into absolute file paths.
    Skips spaces and missing videos.
    """
    paths: List[str] = []
    for token in tokens:
        video = token.get("video")
        if not video:
            continue
        filename = os.path.basename(video)
        abs_path = os.path.join(settings.SIGN_DATA_DIR, filename)
        if os.path.exists(abs_path):
            paths.append(abs_path)
    return paths
