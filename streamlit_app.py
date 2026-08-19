from pathlib import Path

import streamlit as st


ROOT = Path(__file__).parent
PROMPT_PATH = ROOT / "genius_ai_master_prompt_updated.txt"
NOTE_PATH = ROOT / "genius_ai_installable_app_note.md"


@st.cache_data(show_spinner=False)
def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


st.set_page_config(
    page_title="GENIUS AI Master Prompt",
    page_icon="G",
    layout="wide",
)

st.title("GENIUS AI")
st.caption("Learn. Research. Create. Achieve.")
st.write(
    "This public Streamlit viewer presents the GENIUS AI master build specification "
    "and the installable-app implementation guidance."
)

if not PROMPT_PATH.exists() or not NOTE_PATH.exists():
    st.error("The repository files are incomplete. Please confirm both source documents exist.")
    st.stop()

prompt_text = read_text(PROMPT_PATH)
note_text = read_text(NOTE_PATH)

with st.sidebar:
    st.header("Repository files")
    st.write("Use the tabs to read the specification or the implementation note.")
    st.download_button(
        "Download master prompt",
        data=prompt_text,
        file_name=PROMPT_PATH.name,
        mime="text/plain",
        use_container_width=True,
    )
    st.download_button(
        "Download implementation note",
        data=note_text,
        file_name=NOTE_PATH.name,
        mime="text/markdown",
        use_container_width=True,
    )

prompt_tab, note_tab, overview_tab = st.tabs(
    ["Master prompt", "Installable app note", "Overview"]
)

with prompt_tab:
    st.subheader("GENIUS AI Master Prompt")
    st.text_area(
        "Read-only prompt",
        value=prompt_text,
        height=650,
        label_visibility="collapsed",
    )

with note_tab:
    st.subheader("Installable App Requirement")
    st.markdown(note_text)

with overview_tab:
    st.subheader("Repository contents")
    st.markdown(
        """
        This repository contains the GENIUS AI build specification rather than the
        complete AI assistant application. The specification covers local-first AI,
        Ollama integration, study and research modes, document analysis, privacy,
        React/Vite and Streamlit implementations, and an installable PWA experience.
        """
    )
    st.info(
        "The installable-app section requires the future React/Vite implementation "
        "to provide a manifest, service worker, offline fallback, and a respectful "
        "install prompt."
    )
    st.code(
        "github.com/JERRwan/genius-ai-master-prompt",
        language="text",
    )
