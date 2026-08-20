from __future__ import annotations

import os
from pathlib import Path

import requests
import streamlit as st


ROOT = Path(__file__).parent
BRIENNE_DIR = ROOT / "brienne_ai"
APP_TITLE = "BRIENNE AI"
TAGLINE = "Intelligence. Voice. Automation. Under your control."

DOCUMENTS = {
    "Installation Guide": BRIENNE_DIR / "INSTALLATION_GUIDE.md",
    "User Manual": BRIENNE_DIR / "USER_MANUAL.md",
    "Troubleshooting": BRIENNE_DIR / "TROUBLESHOOTING.md",
    "Project README": BRIENNE_DIR / "README.md",
}

st.set_page_config(
    page_title=APP_TITLE,
    page_icon="B",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown(
    """
    <style>
    .brienne-title { font-size: 3rem; font-weight: 800; letter-spacing: -0.05em; margin-bottom: 0; }
    .brienne-tagline { color: #94a3b8; font-size: 1.05rem; margin-top: 0.15rem; }
    .status-card { border: 1px solid rgba(148, 163, 184, 0.25); border-radius: 0.8rem; padding: 1rem; background: rgba(15, 23, 42, 0.55); }
    .notice-card { border-left: 4px solid #38bdf8; padding: 0.75rem 1rem; background: rgba(14, 165, 233, 0.08); }
    </style>
    """,
    unsafe_allow_html=True,
)


def read_document(path: Path) -> str:
    if not path.exists():
        return f"The document `{path.name}` is not available in this checkout."
    return path.read_text(encoding="utf-8")


def ollama_status(base_url: str) -> tuple[bool, list[str], str]:
    normalized = base_url.rstrip("/")
    try:
        response = requests.get(f"{normalized}/api/tags", timeout=3)
        response.raise_for_status()
        payload = response.json()
        models = [
            item.get("name", "")
            for item in payload.get("models", [])
            if isinstance(item, dict) and item.get("name")
        ]
        return True, models, "Ollama responded successfully."
    except requests.RequestException as exc:
        return False, [], f"Ollama is not reachable from this Streamlit process: {exc}"
    except ValueError:
        return False, [], "Ollama returned a response that was not valid JSON."


with st.sidebar:
    st.header("BRIENNE AI")
    st.caption("Documentation preview and deployment companion")
    section = st.radio(
        "Open section",
        ["Overview", *DOCUMENTS.keys(), "Ollama connection"],
    )
    st.divider()
    st.subheader("Preview controls")
    st.download_button(
        "Download master specification",
        data=(BRIENNE_DIR / "BRIENNE_AI_MASTER_DEVELOPMENT_PROMPT.txt").read_text(encoding="utf-8"),
        file_name="BRIENNE_AI_MASTER_DEVELOPMENT_PROMPT.txt",
        mime="text/plain",
        use_container_width=True,
    )
    st.caption("The online preview is safe to deploy as a documentation interface. The full desktop assistant still requires a local Windows/Python/Ollama installation.")

st.markdown(f'<div class="brienne-title">{APP_TITLE}</div>', unsafe_allow_html=True)
st.markdown(f'<div class="brienne-tagline">{TAGLINE}</div>', unsafe_allow_html=True)
st.write("")

if section == "Overview":
    st.info(
        "This Streamlit app previews the BRIENNE AI specification, installation guide, user manual, and troubleshooting documentation. "
        "It does not replace the PyQt6 desktop application."
    )
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Documentation files", len(DOCUMENTS))
    with col2:
        st.metric("Primary AI engine", "Ollama")
    with col3:
        st.metric("Desktop mode", "Offline-first")

    st.subheader("What is included")
    st.markdown(
        "BRIENNE AI is specified as a modular desktop assistant with local Ollama inference, PyQt6 interface, SQLite memory, offline text-to-speech, controlled application and file operations, system monitoring, structured actions, audit logs, and human confirmation for high-risk actions."
    )
    st.markdown(
        '<div class="notice-card"><strong>Important deployment boundary.</strong> Streamlit Community Cloud runs the preview on a remote Linux server. The address <code>127.0.0.1:11434</code> therefore refers to that server, not to Ollama running on your personal computer. Do not expose Ollama to the public internet merely to connect it to this preview.</div>',
        unsafe_allow_html=True,
    )
    st.subheader("Suggested workflow")
    st.write("1. Read the Installation Guide. 2. Use the User Manual to understand safe operation. 3. Run the desktop assistant locally with Ollama. 4. Deploy this Streamlit preview when you want to share the documentation online.")

elif section in DOCUMENTS:
    path = DOCUMENTS[section]
    st.header(section)
    st.caption(str(path.relative_to(ROOT)))
    st.markdown(read_document(path))

else:
    st.header("Ollama connection")
    st.write("Use this diagnostic only when the Ollama endpoint is reachable from the same machine that runs Streamlit.")
    base_url = st.text_input(
        "Ollama base URL",
        value=os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434"),
        help="For local desktop use, the normal endpoint is http://127.0.0.1:11434.",
    )
    if st.button("Check Ollama", type="primary"):
        ready, models, message = ollama_status(base_url)
        if ready:
            st.success(message)
            if models:
                st.write("Installed models:")
                st.code("\n".join(models))
            else:
                st.warning("Ollama responded, but no local models were reported.")
        else:
            st.warning(message)
    st.warning(
        "On Streamlit Community Cloud, this check tests the cloud container. It cannot see Ollama running on your Windows computer. Keep the online preview in documentation/demo mode unless you have a deliberately secured remote inference service."
    )

st.divider()
st.caption("BRIENNE AI documentation preview. Store secrets outside Git, and keep Human Override: ON for desktop automation.")
