"""
Block 4: Text Preprocessing & Block 5: Meaning Extraction (sign-language-friendly).
- Remove filler words (uh, umm), unnecessary symbols, correct basic errors.
- Simplify text for sign-language conversion using the dataset.
"""
import re
from typing import List


# Filler words and sounds to remove (case-insensitive)
FILLER_WORDS: List[str] = [
    "uh", "umm", "um", "uhh", "uhm", "hmm", "hm",
    "ah", "oh", "er", "eh", "like", "you know", "actually",
    "basically", "literally",
]

# Compile pattern for filler words as whole words
_FILLER_PATTERN = re.compile(
    r"\b(" + "|".join(re.escape(w) for w in FILLER_WORDS) + r")\b",
    re.IGNORECASE,
)

# Remove timestamps like [00:00] or (00:01:23)
_TIMESTAMP_PATTERN = re.compile(r"\[\d{1,2}:\d{2}(?::\d{2})?\]|\(\d{1,2}:\d{2}(?::\d{2})?\)")


def preprocess_transcript(raw: str) -> str:
    """
    Block 4: Text Preprocessing.
    - Remove filler words (uh, umm, etc.)
    - Remove timestamps and unnecessary symbols
    - Normalize whitespace
    """
    if not raw or not raw.strip():
        return ""

    text = raw.strip()

    # Remove timestamp-style patterns
    text = _TIMESTAMP_PATTERN.sub(" ", text)

    # Remove filler words
    text = _FILLER_PATTERN.sub(" ", text)

    # Remove extra symbols (keep letters, numbers, basic punctuation . , ? ! ')
    text = re.sub(r"[^\w\s.,?!'\-]", " ", text)

    # Collapse multiple spaces and strip
    text = re.sub(r"\s+", " ", text).strip()

    return text


def simplify_for_sign(text: str) -> str:
    """
    Block 5: Meaning extraction / sign-language-friendly format.
    - Expand common contractions so dataset can match (e.g. "don't" -> "do not")
    - Remove repeated consecutive words
    - Keep sentence structure simple for sign mapping.
    """
    if not text or not text.strip():
        return ""

    t = text.strip()

    # Expand common contractions (sign dataset usually has full forms)
    contractions = [
        (r"\bdon't\b", "do not"),
        (r"\bdoesn't\b", "does not"),
        (r"\bdidn't\b", "did not"),
        (r"\bwon't\b", "will not"),
        (r"\bcan't\b", "cannot"),
        (r"\bisn't\b", "is not"),
        (r"\baren't\b", "are not"),
        (r"\bwasn't\b", "was not"),
        (r"\bweren't\b", "were not"),
        (r"\bhaven't\b", "have not"),
        (r"\bhasn't\b", "has not"),
        (r"\bhadn't\b", "had not"),
        (r"\bwouldn't\b", "would not"),
        (r"\bcouldn't\b", "could not"),
        (r"\bshouldn't\b", "should not"),
        (r"\bi'm\b", "i am"),
        (r"\bwe're\b", "we are"),
        (r"\bthey're\b", "they are"),
        (r"\byou're\b", "you are"),
        (r"\bthat's\b", "that is"),
        (r"\bit's\b", "it is"),
        (r"\bwhat's\b", "what is"),
        (r"\bthere's\b", "there is"),
        (r"\bhere's\b", "here is"),
        (r"\bi've\b", "i have"),
        (r"\bwe've\b", "we have"),
        (r"\bthey've\b", "they have"),
        (r"\byou've\b", "you have"),
        (r"\blet's\b", "let us"),
    ]
    for pat, repl in contractions:
        t = re.sub(pat, repl, t, flags=re.IGNORECASE)

    # Remove repeated consecutive words (e.g. "the the" -> "the")
    t = re.sub(r"\b(\w+)(\s+\1)+\b", r"\1", t, flags=re.IGNORECASE)

    t = re.sub(r"\s+", " ", t).strip()
    return t


def process_for_sign_language(raw_transcript: str) -> str:
    """
    Full pipeline: Preprocessing + Meaning extraction.
    Returns cleaned, sign-language-friendly text ready for dataset mapping.
    """
    step1 = preprocess_transcript(raw_transcript)
    step2 = simplify_for_sign(step1)
    return step2
