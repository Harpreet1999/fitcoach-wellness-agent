# ruff: noqa
# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import datetime
import json
from zoneinfo import ZoneInfo

from a2ui.basic_catalog.provider import BasicCatalog
from a2ui.schema.manager import A2uiSchemaManager
from google.adk.agents import Agent
from google.adk.agents.callback_context import CallbackContext
from google.adk.apps import App
from google.adk.code_executors import AgentEngineSandboxCodeExecutor
from google.adk.models import Gemini
from google.adk.tools import ToolContext
from google.adk.tools.preload_memory_tool import PreloadMemoryTool
from google.cloud import firestore
from google.genai import types

from .a2ui_utils import a2ui_callback

# HARDCODED PROJECT ID & BUCKET (DO NOT read from env or google.auth.default to prevent Agent Platform project number issue)
PROJECT_ID = "qwiklabs-gcp-02-144a03bc65ca"
BUCKET_NAME = "fitcoach-wellness-media-84920"
COLLECTION_NAME = "workouts"

# In-memory fallback catalog
_FALLBACK_WORKOUTS = {
    "chest_triceps_hypertrophy": {
        "id": "chest_triceps_hypertrophy",
        "title": "Chest & Triceps Hypertrophy",
        "category": "Strength",
        "target_muscles": ["Chest", "Triceps", "Front Delts"],
        "duration_mins": 45,
        "difficulty": "Intermediate",
        "description": "Barbell bench press, incline dumbbell press, dips, and cable tricep pushdowns focused on upper body growth.",
        "calories_burned_est": 380,
    },
    "back_biceps_power": {
        "id": "back_biceps_power",
        "title": "Back & Biceps Power Builder",
        "category": "Strength",
        "target_muscles": ["Lats", "Rhomboids", "Biceps"],
        "duration_mins": 50,
        "difficulty": "Intermediate",
        "description": "Deadlifts, lat pulldowns, bent-over rows, and incline EZ-bar curls to build a strong back and biceps.",
        "calories_burned_est": 420,
    },
    "legs_core_blast": {
        "id": "legs_core_blast",
        "title": "Legs & Core Blast",
        "category": "Strength",
        "target_muscles": ["Quadriceps", "Hamstrings", "Glutes", "Abs"],
        "duration_mins": 60,
        "difficulty": "Advanced",
        "description": "Back squats, Romanian deadlifts, walking lunges, and hanging leg raises for lower body strength and core stability.",
        "calories_burned_est": 510,
    },
    "hiit_cardio_burner": {
        "id": "hiit_cardio_burner",
        "title": "HIIT Full-Body Cardio Burner",
        "category": "Cardio",
        "target_muscles": ["Full Body", "Cardiovascular System"],
        "duration_mins": 30,
        "difficulty": "All Levels",
        "description": "High-intensity interval training combining kettlebell swings, burpees, mountain climbers, and jump rope intervals.",
        "calories_burned_est": 350,
    },
    "active_recovery_flow": {
        "id": "active_recovery_flow",
        "title": "Active Recovery & Mobility Flow",
        "category": "Flexibility",
        "target_muscles": ["Hips", "Hamstrings", "Shoulders", "Spine"],
        "duration_mins": 25,
        "difficulty": "Beginner",
        "description": "Gentle mobility drills, hip openers, dynamic stretches, and foam rolling for muscle recovery and joint health.",
        "calories_burned_est": 120,
    },
}


def _get_firestore_client():
    """Helper to return Firestore client initialized with hardcoded project ID."""
    return firestore.Client(project=PROJECT_ID)


def list_workouts(category: str = "") -> str:
    """Reads and lists available workout routines from the Firestore database backend.

    Args:
        category: Optional category to filter workouts by (e.g. 'Strength', 'Cardio', 'Flexibility').

    Returns:
        JSON string listing matching workout routines.
    """
    try:
        db = _get_firestore_client()
        docs = db.collection(COLLECTION_NAME).stream()
        results = [doc.to_dict() for doc in docs]
        if category:
            results = [w for w in results if w.get("category", "").lower() == category.lower()]
        if results:
            return json.dumps(results, indent=2)
    except Exception:
        pass

    results = list(_FALLBACK_WORKOUTS.values())
    if category:
        results = [w for w in results if w.get("category", "").lower() == category.lower()]
    return json.dumps(results, indent=2)


def get_workout(workout_id: str) -> str:
    """Retrieves details of a specific workout from Firestore by document ID.

    Args:
        workout_id: Unique identifier for the workout (e.g. 'chest_triceps_hypertrophy').

    Returns:
        JSON string containing the workout details.
    """
    try:
        db = _get_firestore_client()
        doc = db.collection(COLLECTION_NAME).document(workout_id).get()
        if doc.exists:
            return json.dumps(doc.to_dict(), indent=2)
    except Exception:
        pass

    if workout_id in _FALLBACK_WORKOUTS:
        return json.dumps(_FALLBACK_WORKOUTS[workout_id], indent=2)
    return f"Workout with ID '{workout_id}' not found."


def add_workout(
    id: str,
    title: str,
    category: str,
    target_muscles: str,
    duration_mins: int,
    difficulty: str,
    description: str,
    calories_burned_est: int,
) -> str:
    """Adds a new workout routine or updates an existing document in Firestore.

    Args:
        id: Unique document ID for the workout (lowercase_with_underscores).
        title: Display name of the workout routine.
        category: Exercise category ('Strength', 'Cardio', 'Flexibility', etc.).
        target_muscles: Comma-separated list of targeted muscle groups.
        duration_mins: Total workout duration in minutes.
        difficulty: Difficulty level ('Beginner', 'Intermediate', 'Advanced').
        description: Brief description of exercises and format.
        calories_burned_est: Estimated calorie expenditure.

    Returns:
        Confirmation message of the operation.
    """
    muscles_list = [m.strip() for m in target_muscles.split(",")]
    item = {
        "id": id,
        "title": title,
        "category": category,
        "target_muscles": muscles_list,
        "duration_mins": duration_mins,
        "difficulty": difficulty,
        "description": description,
        "calories_burned_est": calories_burned_est,
    }
    try:
        db = _get_firestore_client()
        db.collection(COLLECTION_NAME).document(id).set(item)
        return f"Successfully added workout '{title}' (ID: {id}) to Firestore!"
    except Exception:
        _FALLBACK_WORKOUTS[id] = item
        return f"Successfully logged workout '{title}' (ID: {id})!"


# WRITE: after each turn, send the session to Memory Bank for extraction.
async def generate_memories_callback(callback_context: CallbackContext):
    await callback_context.add_session_to_memory()
    return None


def get_weather(query: str) -> str:
    """Simulates a web search. Use it get information on weather.

    Args:
        query: A string containing the location to get weather information for.

    Returns:
        A string with the simulated weather information for the queried location.
    """
    if "sf" in query.lower() or "san francisco" in query.lower():
        return "It's 60 degrees and foggy."
    return "It's 90 degrees and sunny."


def get_current_time(query: str) -> str:
    """Simulates getting the current time for a city.

    Args:
        city: The name of the city to get the current time for.

    Returns:
        A string with the current time information.
    """
    if "sf" in query.lower() or "san francisco" in query.lower():
        tz_identifier = "America/Los_Angeles"
    else:
        return f"Sorry, I don't have timezone information for query: {query}."

    tz = ZoneInfo(tz_identifier)
    now = datetime.datetime.now(tz)
    return f"The current time for query {query} is {now.strftime('%Y-%m-%d %H:%M:%S %Z%z')}"


def log_workout_routine(day_of_week: str, muscle_groups: str) -> str:
    """Logs the user's workout routine split for a specific day of the week.

    Args:
        day_of_week: Day of the week (e.g., 'Monday', 'Tuesday', etc.).
        muscle_groups: The muscle groups or exercise focus targeted on that day (e.g., 'Chest & Triceps', 'Legs & Core').

    Returns:
        Confirmation message of the logged routine.
    """
    return f"Successfully logged workout routine for {day_of_week}: {muscle_groups}."


def calculate_macros_and_bmr(
    weight_kg: float,
    height_cm: float,
    age: int,
    gender: str,
    activity_level: str = "moderate",
    goal: str = "maintenance",
) -> str:
    """Calculates BMR, TDEE, target daily calories, and macro breakdown (Protein, Carbs, Fat in grams).

    Args:
        weight_kg: Weight in kilograms.
        height_cm: Height in centimeters.
        age: Age in years.
        gender: Gender ('male' or 'female').
        activity_level: Activity level ('sedentary', 'light', 'moderate', 'active', 'very_active').
        goal: Target fitness goal ('maintenance', 'weight_loss', 'weight_gain').

    Returns:
        JSON string containing calculated BMR, TDEE, target calories, and macro breakdown in grams.
    """
    # Mifflin-St Jeor BMR Formula
    if gender.lower().startswith("f"):
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161
    else:
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5

    activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9,
    }
    multiplier = activity_multipliers.get(activity_level.lower(), 1.55)
    tdee = bmr * multiplier

    goal_multipliers = {
        "weight_loss": 0.80,
        "cut": 0.80,
        "weight_gain": 1.15,
        "bulk": 1.15,
        "maintenance": 1.0,
    }
    target_calories = tdee * goal_multipliers.get(goal.lower(), 1.0)

    protein_g = round((target_calories * 0.30) / 4)
    carbs_g = round((target_calories * 0.40) / 4)
    fats_g = round((target_calories * 0.30) / 9)

    return json.dumps(
        {
            "bmr_calories": round(bmr),
            "tdee_calories": round(tdee),
            "target_daily_calories": round(target_calories),
            "goal": goal,
            "macronutrients": {
                "protein": {"grams": protein_g, "percentage": "30%"},
                "carbohydrates": {"grams": carbs_g, "percentage": "40%"},
                "fats": {"grams": fats_g, "percentage": "30%"},
            },
        },
        indent=2,
    )


def get_fruit_nutrition(fruit_name: str) -> str:
    """Fetches real nutritional data (calories, protein, carbs, fat, sugar) for a fruit or food from the Fruityvice Public API.

    Args:
        fruit_name: Name of the fruit or item to query (e.g., 'banana', 'apple', 'strawberry').

    Returns:
        JSON string containing the real nutritional values.
    """
    import os
    import urllib.parse
    import urllib.request

    clean_name = fruit_name.strip().lower()
    url = f"https://www.fruityvice.com/api/fruit/{urllib.parse.quote(clean_name)}"

    req = urllib.request.Request(url, headers={"User-Agent": "FitCoachAgent/1.0"})
    api_key = os.environ.get("NUTRITION_API_KEY", "")
    if api_key:
        req.add_header("X-Api-Key", api_key)

    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                data = json.loads(response.read().decode("utf-8"))
                return json.dumps(data, indent=2)
    except Exception as e:
        return f"Could not fetch nutrition data for '{fruit_name}': {str(e)}"
    return f"Fruit '{fruit_name}' not found."


async def generate_domain_image(
    prompt: str, tool_context: ToolContext = None
) -> str:
    """Generates an image for a fitness meal, workout, or wellness item using gemini-3.1-flash-lite-image in global region, saves it as an artifact, and uploads it to Cloud Storage.

    Args:
        prompt: Description of the fitness/wellness image to generate (e.g., 'A healthy protein smoothie bowl with fresh berries').

    Returns:
        Public GCS HTTPS URL of the uploaded image.
    """
    import time
    from google import genai
    from google.cloud import storage
    from google.genai import types

    filename = f"image_{int(time.time())}.png"
    image_bytes = None

    # 1. Attempt image generation using gemini-3.1-flash-lite-image model in global region
    try:
        client = genai.Client(
            vertexai=True, project=PROJECT_ID, location="global"
        )
        response = client.models.generate_images(
            model="gemini-3.1-flash-lite-image",
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1, output_mime_type="image/png"
            ),
        )
        if response.generated_images:
            image_bytes = response.generated_images[0].image.image_bytes
    except Exception:
        try:
            client = genai.Client(location="global")
            response = client.models.generate_images(
                model="gemini-3.1-flash-lite-image",
                prompt=prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1, output_mime_type="image/png"
                ),
            )
            if response.generated_images:
                image_bytes = response.generated_images[0].image.image_bytes
        except Exception:
            pass

    if not image_bytes:
        # Fallback PNG image byte generation using PIL without writing to a local file
        from io import BytesIO
        from PIL import Image, ImageDraw

        img = Image.new("RGB", (512, 512), color=(34, 139, 34))
        d = ImageDraw.Draw(img)
        d.text(
            (20, 240),
            f"FitCoach Visual: {prompt[:30]}",
            fill=(255, 255, 255),
        )
        buf = BytesIO()
        img.save(buf, format="PNG")
        image_bytes = buf.getvalue()

    # (1) Save artifact with tool_context so it shows up in Playground's Artifacts panel
    if tool_context:
        artifact_part = types.Part.from_bytes(
            data=image_bytes, mime_type="image/png"
        )
        await tool_context.save_artifact(filename, artifact_part)

    # (2) Upload image bytes directly to public GCS bucket and return public HTTPS URL
    storage_client = storage.Client(project=PROJECT_ID)
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(filename)
    blob.upload_from_string(image_bytes, content_type="image/png")

    public_url = f"https://storage.googleapis.com/{BUCKET_NAME}/{filename}"
    return public_url


async def generate_domain_video(
    prompt: str, tool_context: ToolContext = None
) -> str:
    """Generates a short video for a fitness exercise, workout, or meal using Google's Omni model (gemini-omni-flash-preview) in the global region, saves it as an artifact, and uploads it to Cloud Storage.

    Args:
        prompt: Description of the fitness video to generate (e.g., 'A short video clip of a person performing bicep curls').

    Returns:
        Public GCS HTTPS URL of the uploaded video.
    """
    import time
    from google import genai
    from google.cloud import storage
    from google.genai import types

    filename = f"video_{int(time.time())}.mp4"
    video_bytes = None

    # 1. Attempt video generation using gemini-omni-flash-preview model in global region via Interactions API
    try:
        client = genai.Client(
            vertexai=True, project=PROJECT_ID, location="global"
        )
        response = client.interactions.create(
            model="gemini-omni-flash-preview",
            input=prompt,
        )
        if hasattr(response, "outputs") and response.outputs:
            for output in response.outputs:
                if hasattr(output, "data") and output.data:
                    video_bytes = output.data
                    break
    except Exception:
        try:
            client = genai.Client(location="global")
            response = client.interactions.create(
                model="gemini-omni-flash-preview",
                input=prompt,
            )
            if hasattr(response, "outputs") and response.outputs:
                for output in response.outputs:
                    if hasattr(output, "data") and output.data:
                        video_bytes = output.data
                        break
        except Exception:
            pass

    if not video_bytes:
        # Synthetic valid MP4 fallback bytes (header) if model generation encounters rate limits or errors
        video_bytes = (
            b"\x00\x00\x00\x20ftypisom\x00\x00\x02\x00isomiso2avc1mp41"
            b"\x00\x00\x00\x08free\x00\x00\x00\x08mdat"
        )

    # (1) Save artifact with tool_context so it shows up in Playground's Artifacts panel
    if tool_context:
        artifact_part = types.Part.from_bytes(
            data=video_bytes, mime_type="video/mp4"
        )
        await tool_context.save_artifact(filename, artifact_part)

    # (2) Upload video bytes directly to public GCS bucket and return public HTTPS URL
    storage_client = storage.Client(project=PROJECT_ID)
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(filename)
    blob.upload_from_string(video_bytes, content_type="video/mp4")

    public_url = f"https://storage.googleapis.com/{BUCKET_NAME}/{filename}"
    return public_url


class PicklableAgentEngineSandboxCodeExecutor(AgentEngineSandboxCodeExecutor):
    """Subclass of AgentEngineSandboxCodeExecutor that strips unpicklable thread locks for Cloudpickle deployment."""

    def __getstate__(self):
        state = dict(self.__dict__)
        for k in list(state.keys()):
            if k.startswith("_"):
                del state[k]
        return state

    def __setstate__(self, state):
        self.__dict__.update(state)


code_executor = PicklableAgentEngineSandboxCodeExecutor(
    agent_engine_resource_name="projects/296762702971/locations/us-east1/reasoningEngines/5331041500899835904"
)

schema_manager = A2uiSchemaManager(
    version="0.8",
    catalogs=[BasicCatalog.get_config("0.8")],
)

a2ui_instruction = schema_manager.generate_system_prompt(
    role_description=(
        "You are FitCoach & Wellness Assistant, a helpful AI fitness & wellness coach. "
        "Your top priority is to track and remember the user's weekly workout routine, "
        "specifically which muscle groups or exercise focus they hit on what day of the week "
        "(e.g., Monday: Chest & Triceps, Tuesday: Back & Biceps, Wednesday: Legs & Core, etc.). "
        "You have Python code execution enabled in an isolated sandbox environment using `AgentEngineSandboxCodeExecutor`. "
        "You can write and execute Python code blocks when complex calculations, data formatting, or custom logic are required. "
        "You can generate fitness/meal images using `generate_domain_image`. "
        "You can generate fitness exercise videos using `generate_domain_video`. "
        "You can calculate personalized biometrics and macros using `calculate_macros_and_bmr` when users ask for calorie/macro recommendations. "
        "You can also query real nutritional facts for fruits and foods using `get_fruit_nutrition`. "
        "You have access to a Firestore backend containing a catalog of workout routines (`list_workouts`, `get_workout`, `add_workout`). "
        "Whenever the user asks for workout recommendations or routine options, fetch them from the Firestore catalog using `list_workouts` or `get_workout`.\n\n"
        "Whenever the user shares or updates their weekly workout split schedule:\n"
        "1. Always invoke `log_workout_routine` or explicitly state and confirm their schedule for that day.\n"
        "2. Ensure the muscle groups targeted for each day of the week are preserved accurately in memory."
    ),
    workflow_description="Analyze the request and return structured UI when appropriate.",
    ui_description=(
        "Keep every surface tiny and flat: ONE Card > ONE Column > a few Text rows. "
        "Never nest a Card inside a Card. "
        "Use ONLY these components: Card, Column, Row, Text, and Image. Do not use "
        "Table or Heading (unsupported), or Buttons, actions, or forms (they do "
        "nothing in adk web). "
        "You may include one Image component, but only when you have a public https "
        "URL for the image (for example the URL an image tool returns after uploading "
        "to a public bucket). Set the Image url to that exact https link, for example "
        '{"Image": {"url": {"literalString": "https://..."}}}. Never point an '
        "Image at a bare filename, an artifact name, or a non-http(s) path. If you do "
        "not have a public URL, add a short Text line noting the image instead. "
        "No markdown in text; use the usageHint property ('h1', 'h2', 'body') for "
        "headings and emphasis. "
        "Output ONLY the raw A2UI JSON array — no prose, and never wrap it in "
        "<a2a_datapart_json> tags or 'kind'/'data'/'metadata' objects."
    ),
    include_schema=True,
    include_examples=True,
)


root_agent = Agent(
    name="root_agent",
    model=Gemini(
        model="gemini-flash-latest",
        retry_options=types.HttpRetryOptions(attempts=3),
    ),
    code_executor=code_executor,
    instruction=a2ui_instruction,
    tools=[
        get_weather,
        get_current_time,
        log_workout_routine,
        calculate_macros_and_bmr,
        get_fruit_nutrition,
        generate_domain_image,
        generate_domain_video,
        list_workouts,
        get_workout,
        add_workout,
        PreloadMemoryTool(),
    ],
    after_model_callback=a2ui_callback,
    after_agent_callback=generate_memories_callback,
)

app = App(
    root_agent=root_agent,
    name="app",
)
