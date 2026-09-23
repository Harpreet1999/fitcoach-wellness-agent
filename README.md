# FitCoach AI — Personal Wellness Assistant 🏋️‍♂️

FitCoach AI (`fitcoach-wellness-agent`) is an AI-powered fitness and wellness assistant built with Google's Agent Development Kit (ADK) and deployed to **Vertex AI Agent Engine / Agent Runtime**. It delivers personalized workout split tracking, biometrics calculation, database workout lookup, dynamic A2UI surface rendering, and multimodal media generation (images and videos).

---

## 🌟 Key Features & Capabilities

The following capabilities are fully implemented in code (`app/agent.py`):

- **Weekly Workout Split Tracking & Memory Bank**:
  - Uses `PreloadMemoryTool` and `generate_memories_callback` (Memory Bank) to persist long-term user workout splits (e.g. Monday: Chest & Triceps, Tuesday: Back & Biceps).
  - Logs user-provided schedules via the `log_workout_routine` tool.

- **Cloud Firestore Workout Catalog**:
  - Direct integration with Google Cloud Firestore (`list_workouts`, `get_workout`, `add_workout`) to query and update workout routines in real time.

- **Multimodal Image Generation**:
  - `generate_domain_image` tool using `gemini-3.1-flash-lite-image` in the `global` region.
  - Automatically saves artifacts to the agent context and uploads image bytes directly to a public Google Cloud Storage bucket (`gs://fitcoach-wellness-media-84920`).

- **Multimodal Video Generation**:
  - `generate_domain_video` tool using Google's Omni model (`gemini-omni-flash-preview`) in the `global` region via the Interactions API.
  - Saves MP4 artifacts and uploads video bytes directly to Google Cloud Storage.

- **Biometric & Macro Calculation**:
  - `calculate_macros_and_bmr` calculates BMR (Mifflin-St Jeor), TDEE, and daily target macros (Protein, Carbs, Fat in grams) based on weight, height, age, activity level, and fitness goals.

- **Public Nutrition API Integration**:
  - `get_fruit_nutrition` fetches nutritional data (calories, protein, carbs, fat, sugar) for fruits and foods via the Fruityvice API.

- **A2UI Dynamic User Interfaces**:
  - Integrated `A2uiSchemaManager` (version 0.8) and `BasicCatalog` with an `after_model_callback` (`a2ui_callback`) to render structured cards (`Card`, `Column`, `Row`, `Text`, `Image`) in modern web interfaces.

- **Sandbox Python Code Execution**:
  - Wired with `AgentEngineSandboxCodeExecutor` (`PicklableAgentEngineSandboxCodeExecutor`) to execute code blocks safely for complex calculations.

---

## 📋 Planned / Future Enhancements

- **Wearable Sensor Stream Integration**: Real-time heart rate and activity stream syncing (planned, not yet implemented).

---

## 🏗️ Project Architecture

```
.
├── agents-cli-manifest.yaml    # Agent manifest (acli 1.1.0, us-east1, Agent Runtime)
├── deployment_metadata.json    # Agent Engine resource deployment metadata
├── pyproject.toml              # Dependencies (google-adk, google-genai, google-cloud-firestore, etc.)
├── app/
│   ├── __init__.py
│   ├── agent.py               # Main ADK Agent, tools, A2UI setup, & GCS media tools
│   └── a2ui_utils.py          # A2UI callback handler for structured UI streaming
└── frontend/
    ├── Dockerfile             # Container definition for Cloud Run deployment
    ├── main.py                # FastAPI proxy server forwarding A2A protocol requests
    ├── requirements.txt       # Frontend dependencies (fastapi, uvicorn, httpx, a2a-sdk)
    └── static/
        └── index.html         # Responsive chat UI with teal theme & A2UI renderer
```

---

## 🚀 Local Setup & Run Instructions

### Prerequisites

- Python 3.11+
- Google Cloud SDK (`gcloud`) with active authentication (`gcloud auth application-default login`)

### Installation

1. **Clone the repository and install dependencies**:
   ```bash
   pip install -e .
   ```

2. **Navigate to the frontend proxy**:
   ```bash
   cd frontend
   pip install -r requirements.txt
   ```

3. **Set Environment Variables**:
   ```bash
   export AGENT_ENGINE_RESOURCE_NAME="projects/<PROJECT_ID>/locations/<LOCATION>/reasoningEngines/<ENGINE_ID>"
   export AGENT_DIRECTORY="app"
   ```

4. **Start the Local Proxy Server**:
   ```bash
   python main.py
   ```

5. **Open in Web Browser**:
   Navigate to the server address displayed in your console output (e.g. `http://localhost:8080`).

---

## 📜 License

Apache License 2.0. See `LICENSE` for details.
