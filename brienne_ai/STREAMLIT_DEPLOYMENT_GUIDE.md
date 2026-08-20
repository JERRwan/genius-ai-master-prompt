# BRIENNE AI — Streamlit Preview and Online Deployment Guide

**Repository:** [JERRwan/genius-ai-master-prompt](https://github.com/JERRwan/genius-ai-master-prompt)  
**Streamlit entrypoint:** `brienne_streamlit_app.py`  
**Preview purpose:** Online documentation and project-status preview

## Important architecture boundary

The Streamlit app in this repository is a **web preview of the BRIENNE AI documentation and configuration package**. It is not the PyQt6 desktop assistant itself. The desktop assistant requires Python, Windows-compatible desktop libraries, and a local Ollama installation.

The desktop configuration uses:

```text
http://127.0.0.1:11434
```

When the app is deployed to Streamlit Community Cloud, `127.0.0.1` points to the remote Streamlit server, not to Ollama on your personal computer. Consequently, the online preview cannot automatically use an Ollama instance running on your Windows machine. Do not expose Ollama to the public internet just to connect it to this preview.

Streamlit Community Cloud is appropriate here for sharing the documentation preview. The full offline-first desktop assistant should be run locally.

## 1. Files used by the preview

| File | Role |
|---|---|
| `brienne_streamlit_app.py` | Streamlit entrypoint for the web preview |
| `requirements.txt` | Root dependency file used by the existing Streamlit app and preview |
| `brienne_ai/INSTALLATION_GUIDE.md` | Windows and local Ollama setup instructions |
| `brienne_ai/USER_MANUAL.md` | Desktop assistant operating manual |
| `brienne_ai/TROUBLESHOOTING.md` | Recovery and diagnostic guidance |
| `brienne_ai/BRIENNE_AI_MASTER_DEVELOPMENT_PROMPT.txt` | Original supplied project specification |
| `brienne_ai/.env.example` | Example local configuration; it contains no secrets |

Streamlit Community Cloud looks for a Python dependency file in the app directory or repository root. The root `requirements.txt` is therefore intentionally retained and includes `streamlit` for this preview [2].

## 2. Preview locally on Windows

### Step 1: Install or verify Python

Use Python 3.11 or newer. Open PowerShell and verify:

```powershell
python --version
```

### Step 2: Clone the repository

```powershell
git clone https://github.com/JERRwan/genius-ai-master-prompt.git
cd genius-ai-master-prompt
```

### Step 3: Create a virtual environment

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation for the current session, run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

### Step 4: Install preview dependencies

```powershell
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
```

For a smaller preview-only environment, the app imports only `streamlit` and `requests`. You may install those directly instead:

```powershell
python -m pip install "streamlit>=1.37,<2.0" "requests>=2.31,<3.0"
```

### Step 5: Start the preview

```powershell
streamlit run brienne_streamlit_app.py
```

Streamlit will print a local URL, normally similar to:

```text
http://localhost:8501
```

Open that address in a browser. Use the left sidebar to switch between the overview, installation guide, user manual, troubleshooting guide, README, and Ollama connection diagnostic.

### Step 6: Preview the Ollama diagnostic locally

If Ollama is installed and running on the same Windows computer, leave the default URL as:

```text
http://127.0.0.1:11434
```

Open **Ollama connection** and select **Check Ollama**. A successful check displays the installed models. If you are only previewing the documentation, Ollama is not required for the Streamlit page itself.

## 3. Push changes to GitHub

After editing files locally, inspect the changes:

```powershell
git status
git diff --stat
git diff -- brienne_streamlit_app.py brienne_ai/STREAMLIT_DEPLOYMENT_GUIDE.md
```

Commit and push them:

```powershell
git add brienne_streamlit_app.py brienne_ai

git commit -m "Add BRIENNE AI documentation and Streamlit preview"
git push origin main
```

Streamlit Community Cloud can deploy from a GitHub repository and will rebuild the app when the connected repository is updated. The official deployment workflow uses a workspace's **Create app** control, followed by repository, branch, and entrypoint selection [1].

## 4. Deploy on Streamlit Community Cloud

### Step 1: Open Streamlit Community Cloud

Go to [share.streamlit.io](https://share.streamlit.io/) and sign in with the GitHub account that can access `JERRwan/genius-ai-master-prompt`. Streamlit's deployment documentation describes Community Cloud as a GitHub-based, one-click deployment workflow [1].

### Step 2: Create an app

In the Streamlit workspace, select **Create app**. Choose the option to deploy from an existing GitHub repository.

### Step 3: Select the repository

Enter or select:

| Field | Value |
|---|---|
| Repository | `JERRwan/genius-ai-master-prompt` |
| Branch | `main` |
| Main file path | `brienne_streamlit_app.py` |
| App URL | Choose an available name, such as `brienne-ai-preview` |

The main file path must point to the file at the repository root. Do not select the existing `streamlit_app.py` unless you want to deploy the GENIUS AI application already in the repository.

### Step 4: Configure advanced settings

Open **Advanced settings** before deploying. Select a Python version compatible with the repository dependencies and add secrets only if the app later requires them. This preview does not require secrets.

Do not paste `.env` contents, passwords, API keys, or private endpoints into GitHub. Streamlit recommends storing secrets outside the repository and entering them in the app's secrets interface [3].

### Step 5: Deploy

Select **Deploy**. Community Cloud will install the dependencies it finds in the repository's dependency file and start `brienne_streamlit_app.py`. The first build may take several minutes. The app log is the first place to look if the build or startup fails.

### Step 6: Verify the live preview

After deployment, verify the following:

| Check | Expected result |
|---|---|
| Page loads | The BRIENNE AI title and tagline are visible |
| Sidebar | Overview, Installation Guide, User Manual, Troubleshooting, Project README, and Ollama connection are listed |
| Documentation | Each document opens without a missing-file message |
| Specification download | The master specification downloads as a text file |
| Ollama warning | The page explains that Community Cloud cannot see local Windows Ollama |
| Repository updates | A later GitHub push triggers a new deployment/rebuild |

## 5. Updating the online preview

Edit the repository locally, test the preview, commit, and push:

```powershell
streamlit run brienne_streamlit_app.py

git add brienne_streamlit_app.py brienne_ai

git commit -m "Update BRIENNE AI preview documentation"
git push origin main
```

Streamlit Community Cloud normally detects the GitHub update and redeploys the connected app. If the page does not update, open the app's management page, review the deployment log, and use the app's reboot or redeploy control.

## 6. Troubleshooting deployment

### The repository does not appear

Confirm that you signed in to Streamlit with the GitHub account `JERRwan` and that the repository is accessible to that account. If the repository is private, approve the GitHub access requested by Streamlit before retrying.

### `ModuleNotFoundError: streamlit`

Confirm that the root `requirements.txt` is committed and contains a Streamlit dependency. Streamlit Community Cloud uses a recognized dependency file to install imported Python packages [2]. Push the file and redeploy.

### The app cannot find a documentation file

Check that the `brienne_ai` directory and its Markdown files were committed. The entrypoint uses paths relative to the repository root, so do not rename the directory without also updating `brienne_streamlit_app.py`.

### The Ollama check fails online

This is expected when Ollama is running only on your personal computer. The online app is hosted on a different machine. Use the Ollama diagnostic locally, or keep the online app in documentation-preview mode.

### A desktop dependency causes a cloud build problem

The preview imports only Streamlit and Requests, but the repository's root requirements file also contains the existing GENIUS AI document-preview dependencies. If a future desktop-only dependency is added to the root file, place a preview-specific dependency file beside the preview entrypoint and deploy that entrypoint. Streamlit documentation warns that only one dependency file is used for an app and that the file closest to the entrypoint takes precedence [2].

### Secrets are exposed in Git

Immediately revoke the exposed credential, remove it from the repository history where appropriate, and store the replacement in Streamlit's **Advanced settings → Secrets** interface. A `.env.example` file may be committed only when it contains placeholders and no real credentials.

## 7. What can and cannot be deployed online

| Capability | Streamlit online preview | Local desktop installation |
|---|---:|---:|
| Documentation browsing | Yes | Yes |
| Specification download | Yes | Yes |
| Static configuration preview | Yes | Yes |
| Local Ollama on your Windows computer | No | Yes |
| PyQt6 desktop interface | No | Yes |
| Windows application launching | No | Yes |
| Local file automation | No | Yes, with confirmation and audit logging |
| Offline text-to-speech | No, unless a remote-compatible service is deliberately configured | Yes |
| System monitoring of your computer | No | Yes |

## References

[1]: https://docs.streamlit.io/deploy/streamlit-community-cloud/deploy-your-app "Streamlit Community Cloud: Prep and deploy your app"

[2]: https://docs.streamlit.io/deploy/streamlit-community-cloud/deploy-your-app/app-dependencies "Streamlit Community Cloud: App dependencies"

[3]: https://docs.streamlit.io/deploy/streamlit-community-cloud/deploy-your-app/secrets-management "Streamlit Community Cloud: Secrets management"

## Author

**Manus AI**
