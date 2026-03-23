import os
import time
import base64
from typing import Optional, List, Dict

import streamlit as st
import google.generativeai as genai

# =========================
# GLOBAL SETTINGS & CONFIG
# =========================

st.set_page_config(
    page_title="Signify – Inclusive Technical Education",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Folder containing all sign videos (word and alphabet signs)
SIGN_FOLDER = "sign_data"
DISPLAY_TIME = 1.5  # seconds each sign is shown



genai.configure(api_key="AIzaSyDRZSKyz-xc09WyIY6Nty9ceX_uVbBdHyc")
gemini_model = genai.GenerativeModel("gemini-2.5-flash")

# =========================
# LOW-LEVEL SIGN UTILITIES
# (YOUR ORIGINAL LOGIC, REFACTORED)
# =========================

def play_video(video_path: str) -> str:
    """Read a video file and return base64-encoded content."""
    with open(video_path, "rb") as f:
        video_bytes = f.read()
    return base64.b64encode(video_bytes).decode()


def show_sign(video_base64: str, placeholder, width: int = 400):
    """Render a single sign video and wait DISPLAY_TIME seconds."""
    placeholder.markdown(
        f"""
        <video autoplay muted width="{width}">
            <source src="data:video/mp4;base64,{video_base64}" type="video/mp4">
        </video>
        """,
        unsafe_allow_html=True,
    )
    time.sleep(DISPLAY_TIME)


def get_sign(name: str) -> Optional[str]:
    """Return base64 video for a given sign name (word or character), if it exists."""
    path = os.path.join(SIGN_FOLDER, f"{name}.mp4")
    if os.path.exists(path):
        return play_video(path)
    return None


def render_sign_for_text(text: str, placeholder, width: int = 400):
    """
    Take text, split into words, and display the best available sign sequence:

    - Try word-level signs
    - Fallback to letter-by-letter signs (A–Z)
    """
    output_text = text.lower()

    for word in output_text.split():
        video = get_sign(word)

        if video:
            show_sign(video, placeholder, width=width)
        else:
            # Letter-by-letter fallback
            for char in word:
                if char.isalpha():
                    video = get_sign(char.upper())
                    if video:
                        show_sign(video, placeholder, width=width)

    # Clear placeholder at the end
    placeholder.empty()


# =========================
# AI HELPERS
# =========================

def gemini_generate_one_line(prompt: str) -> str:
    """Use Gemini to generate a short, simple response."""
    resp = gemini_model.generate_content(prompt + " Answer in one simple and clear line.")
    return (resp.text or "").strip()


def gemini_transcribe_video_bytes(video_bytes: bytes, mime_type: str = "video/mp4") -> str:
    """
    Use Gemini 2.5 Flash to transcribe a video file.
    This provides a simple speech-to-text pipeline.
    """
    try:
        resp = gemini_model.generate_content(
            [
                "Transcribe the spoken content in this lecture video. "
                "Return only the transcript text, no extra commentary.",
                {
                    "mime_type": mime_type,
                    "data": video_bytes,
                },
            ]
        )
        return (resp.text or "").strip()
    except Exception as e:
        return f"[Transcription error: {e}]"


# =========================
# ACCESSIBLE UI COMPONENTS
# =========================

def app_header():
    col1, col2 = st.columns([1, 3])
    with col1:
        st.markdown(
            "<div style='font-size:48px; font-weight:700; line-height:1;'>Signify</div>",
            unsafe_allow_html=True,
        )
        st.caption("Inclusive Technical Education for Deaf and Mute Students in India")
    with col2:
        st.markdown(
            """
            <div style="
                padding: 18px;
                border-radius: 16px;
                background: linear-gradient(135deg, #0f172a, #1d4ed8);
                color: white;
                font-size: 16px;
            ">
                <strong>Mission:</strong> Standardize technical sign language, enable independent learning,
                and bridge the gap from education to employability — with AI, accessibility, and dignity at the core.
            </div>
            """,
            unsafe_allow_html=True,
        )


def sidebar_nav() -> str:
    st.sidebar.markdown("## Navigation")
    page = st.sidebar.radio(
        "Go to",
        [
            "Learn Signs",
            "YouTube Learning",
            "Upload Lecture",
            "AI Chatbot",
            "Jobs & Opportunities",
        ],
        index=0,
    )

    st.sidebar.markdown("---")
    st.sidebar.markdown("### Accessibility")
    st.sidebar.checkbox("High contrast mode (visual only)", value=True, disabled=True)
    st.sidebar.checkbox("Large text", value=True, disabled=True)

    return page


# =========================
# PAGE 1 – STANDARDIZED SIGN LEARNING
# =========================

# Example vocabulary; in production, this should come from a DB
TECH_VOCAB = {
    "python": "A popular programming language used for AI, web, and scripting.",
    "java": "An object-oriented programming language used for large-scale systems.",
    "variable": "A named storage location that can hold a value.",
    "loop": "A structure that repeats a block of code.",
    "function": "A reusable block of code that performs a specific task.",
    "database": "An organized collection of structured information or data.",
}


def page_learn_signs():
    st.markdown("### Learn Standardized Technical Signs")
    st.write(
        "Explore key engineering and computer science terms in Indian Sign Language (ISL). "
        "Each term includes a simple meaning and sign video if available."
    )

    search = st.text_input("Search technical term (e.g. Python, loop, function)")
    terms = [t for t in TECH_VOCAB if not search or search.lower() in t.lower()]

    if not terms:
        st.warning("No matching terms found. Try another keyword.")
        return

    cols = st.columns(2)
    placeholder = st.empty()

    for i, term in enumerate(sorted(terms)):
        with cols[i % 2]:
            st.markdown(f"**{term.capitalize()}**")
            st.caption(TECH_VOCAB[term])

            video = get_sign(term.lower())
            if video:
                st.markdown(
                    f"""
                    <video controls muted width="320" style="border-radius:12px; margin-bottom:8px;">
                        <source src="data:video/mp4;base64,{video}" type="video/mp4">
                    </video>
                    """,
                    unsafe_allow_html=True,
                )
            else:
                st.info("Sign video not found. Using letter-by-letter fallback.")
                fallback_placeholder = st.empty()
                render_sign_for_text(term, fallback_placeholder, width=220)


# =========================
# PAGE 2 – YOUTUBE LEARNING
# =========================

def page_youtube_learning():
    st.markdown("### AI-Powered YouTube Learning")
    st.write(
        "Search or paste a YouTube link for technical topics. "
        "Signify will help you learn by combining the video with sign-language guidance."
    )

    topic = st.text_input("Enter topic, concept, or YouTube URL")
    col1, col2 = st.columns([2, 3])

    with col1:
        mode = st.radio(
            "Mode",
            ["Paste YouTube URL + Transcript", "Simple Topic Mode (text-only demo)"],
            index=0,
        )

    if mode == "Paste YouTube URL + Transcript":
        with col2:
            st.write("For now, please paste the transcript text below (YouTube auto-generated or manual).")
            transcript = st.text_area(
                "Transcript text",
                height=200,
                placeholder="Paste the transcript here. The platform will map it to sign language.",
            )
    else:
        transcript = ""

    if st.button("Start Learning", type="primary"):
        if not topic.strip():
            st.warning("Please enter a topic or YouTube URL.")
            return

        if mode == "Paste YouTube URL + Transcript" and not transcript.strip():
            st.warning("Please provide transcript text to proceed.")
            return

        st.success("Learning session started.")
        video_col, sign_col = st.columns([3, 2])

        with video_col:
            st.markdown("#### Video / Topic")
            if "youtube.com" in topic or "youtu.be" in topic:
                st.markdown(
                    f"""
                    <iframe width="100%" height="360"
                        src="https://www.youtube.com/embed/{topic.split('=')[-1]}"
                        title="YouTube video player" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        style="border-radius:16px;">
                    </iframe>
                    """,
                    unsafe_allow_html=True,
                )
            else:
                st.info("Showing text-based explanation for the topic (demo).")
                with st.spinner("Generating explanation with AI..."):
                    explanation = gemini_generate_one_line(
                        f"Explain the topic '{topic}' for a deaf student using very simple English."
                    )
                st.write(explanation)

        with sign_col:
            st.markdown("#### Sign-Language Assistance")
            placeholder = st.empty()

            if transcript.strip():
                st.caption("Playing sign sequence based on provided transcript...")
                render_sign_for_text(transcript, placeholder)
            else:
                st.caption("Playing sign sequence for the AI text explanation...")
                explanation_text = gemini_generate_one_line(
                    f"Summarize the topic '{topic}' in one very short, simple sentence."
                )
                render_sign_for_text(explanation_text, placeholder)


# =========================
# PAGE 3 – LECTURE UPLOAD & INSTANT SIGN CONVERSION
# =========================

def page_upload_lecture():
    st.markdown("### Upload Lecture – Instant Sign Conversion")
    st.write(
        "Upload a recorded lecture. The platform will transcribe the lecture using AI and "
        "render a sign-language friendly view alongside the original video."
    )

    uploaded = st.file_uploader(
        "Upload lecture video (MP4 recommended)",
        type=["mp4", "mov", "mkv", "webm"],
        accept_multiple_files=False,
    )

    if uploaded is None:
        st.info("Upload a lecture video to begin.")
        return

    st.video(uploaded)

    if st.button("Process Lecture", type="primary"):
        with st.spinner("Transcribing and preparing sign-language view using Gemini..."):
            video_bytes = uploaded.read()
            transcript = gemini_transcribe_video_bytes(video_bytes)

        if not transcript or transcript.startswith("[Transcription error"):
            st.error("Could not transcribe the lecture. Please try again or use a shorter clip.")
            st.text_area("Raw transcription result", transcript, height=200)
            return

        st.success("Lecture processed successfully.")

        col_video, col_sign = st.columns([3, 2])

        with col_video:
            st.markdown("#### Original Lecture")
            st.video(uploaded)

        with col_sign:
            st.markdown("#### Sign-Language Rendering")
            st.caption("This is a sequential sign rendering of the transcribed lecture.")
            placeholder = st.empty()
            render_sign_for_text(transcript, placeholder)


# =========================
# PAGE 4 – AI CHATBOT (YOUR TEXT→SIGN CODE)
# =========================

def init_chat_state():
    if "chat_messages" not in st.session_state:
        st.session_state["chat_messages"] = []  # list of dicts: {role, content}


def page_ai_chatbot():
    st.markdown("### AI Chatbot – Ask Your Doubts")
    st.write(
        "Ask any academic or technical question. The chatbot will reply in simple text and "
        "play the corresponding sign-language sequence."
    )

    init_chat_state()

    # Show chat history
    for msg in st.session_state["chat_messages"]:
        with st.chat_message(msg["role"]):
            st.write(msg["content"])

    user_input = st.chat_input("Type your question in simple English...")

    if user_input:
        # Add user message to history
        st.session_state["chat_messages"].append(
            {"role": "user", "content": user_input}
        )
        with st.chat_message("user"):
            st.write(user_input)

        # Generate assistant response (using your logic pattern)
        with st.chat_message("assistant"):
            with st.spinner("Thinking in simple, clear language..."):
                response_text = gemini_generate_one_line(user_input)

            st.write(response_text)

            # Sign rendering area
            st.caption("Sign-language response:")
            placeholder = st.empty()
            render_sign_for_text(response_text, placeholder)

        # Save assistant message
        st.session_state["chat_messages"].append(
            {"role": "assistant", "content": response_text}
        )


# =========================
# PAGE 5 – JOBS & OPPORTUNITIES
# =========================

# Example static dataset; in production this should aggregate from APIs like LinkedIn, NCS, etc.
JOBS_DATA = [
    {
        "title": "Junior Python Developer",
        "company": "Inclusive Tech Labs",
        "location": "Bengaluru, Karnataka",
        "skills": ["Python", "Git", "APIs"],
        "accessible": True,
    },
    {
        "title": "QA Engineer (Accessibility Focus)",
        "company": "EqualAccess Software",
        "location": "Remote (India)",
        "skills": ["Testing", "Automation", "WCAG"],
        "accessible": True,
    },
    {
        "title": "IT Support Trainee",
        "company": "City Engineering College",
        "location": "Pune, Maharashtra",
        "skills": ["Basics of networking", "Windows", "Hardware"],
        "accessible": False,
    },
]


def page_jobs():
    st.markdown("### Jobs & Opportunities")
    st.write(
        "Discover job roles and internships curated for deaf and mute candidates. "
        "Filter by skills and location to plan your path from education to employment."
    )

    col1, col2, col3 = st.columns([2, 2, 1])

    with col1:
        skill_filter = st.text_input(
            "Filter by skill (e.g. Python, testing, networking)", ""
        )
    with col2:
        location_filter = st.text_input(
            "Filter by location (e.g. Bengaluru, Remote)", ""
        )
    with col3:
        only_accessible = st.checkbox("Accessible-friendly only", value=True)

    def matches(job: Dict) -> bool:
        if skill_filter:
            if not any(
                skill_filter.lower() in s.lower() for s in job["skills"]
            ):
                return False
        if location_filter:
            if location_filter.lower() not in job["location"].lower():
                return False
        if only_accessible and not job["accessible"]:
            return False
        return True

    filtered_jobs: List[Dict] = [j for j in JOBS_DATA if matches(j)]

    if not filtered_jobs:
        st.warning("No jobs match your current filters. Try adjusting the filters.")
        return

    for job in filtered_jobs:
        with st.container():
            st.markdown(
                f"""
                <div style="
                    border-radius: 16px;
                    padding: 16px 20px;
                    margin-bottom: 12px;
                    background: #020617;
                    color: #e5e7eb;
                    border: 1px solid #1f2937;
                ">
                    <div style="font-size:20px; font-weight:600;">{job['title']}</div>
                    <div style="font-size:14px; color:#9ca3af; margin-bottom:4px;">
                        {job['company']} • {job['location']}
                    </div>
                    <div style="font-size:14px; margin-bottom:6px;">
                        <strong>Skills:</strong> {", ".join(job['skills'])}
                    </div>
                    <div style="font-size:13px; color:{'#22c55e' if job['accessible'] else '#f97316'};">
                        {"✅ Deaf- & mute-friendly workplace" if job['accessible'] else "⚠️ Accessibility to be confirmed"}
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )


# =========================
# MAIN APP ROUTER
# =========================

def main():
    app_header()
    page = sidebar_nav()

    st.markdown("---")

    if page == "Learn Signs":
        page_learn_signs()
    elif page == "YouTube Learning":
        page_youtube_learning()
    elif page == "Upload Lecture":
        page_upload_lecture()
    elif page == "AI Chatbot":
        page_ai_chatbot()
    elif page == "Jobs & Opportunities":
        page_jobs()


if __name__ == "__main__":
    main()