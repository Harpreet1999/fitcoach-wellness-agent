# FitCoach AI — Project Specification & Context Document

> **FitCoach AI** is an intelligent, multi-turn personal wellness assistant and autonomous fitness coach built on Google Gemini and Google's Agent Development Kit (ADK) architecture.

---

## 1. Executive Summary

- **Project Name**: FitCoach AI — Personal Wellness Agent
- **Event**: Google Build with Gemini 2026
- **Developer**: Harpreet Singh ([harpreetsingh.xyz](https://harpreetsingh.xyz) · [GitHub](https://github.com/Harpreet1999))
- **Core Value Proposition**: Replaces generic fitness chatbots with an autonomous wellness coach that executes deterministic biometric calculations, tracks weekly training splits in browser memory, and streams structured, interactive UI cards (A2UI) directly inside the conversation.

---

## 2. System Architecture

FitCoach AI follows a **5-Stage Pipeline** connecting the user interface to Google Gemini reasoning and deterministic tools:

```
[User Input] 
     │
     ▼
┌────────────────────────────────────────────────────────┐
│ STAGE 01 // Client Surface & A2UI Renderer             │
│ Next.js 16 App Router · Monochromatic Kanso Design     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ STAGE 02 // Context Assembly & Profile Buffer          │
│ In-Session localStorage (`fitcoach_messages`, profile) │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ STAGE 03 // Gemini Reasoning Core                      │
│ Model: `gemini-3.5-flash` (with fallback candidates)   │
│ Protocol: Google ADK Native Function Calling           │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ STAGE 04 // Tool Dispatch Router                       │
│ Executes local & remote deterministic fitness engines  │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ STAGE 05 // Cloud & Data Vault                         │
│ Cloud Firestore · Cloud Run · Vertex AI Agent Engine   │
└────────────────────────────────────────────────────────┘
```

---

## 3. Tool Specifications & APIs

The reasoning core has access to 6 function declarations declared via Google ADK / Gemini Function Calling:

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| `calculate_macros_and_bmr` | `weight_kg`, `height_cm`, `age`, `gender`, `activity_level`, `goal` | Computes Basal Metabolic Rate (Mifflin-St Jeor), Total Daily Energy Expenditure (TDEE), caloric deficit/surplus, and macro grams (Protein, Carbs, Fat). |
| `log_workout_routine` | `day`, `muscleGroups`, `notes` | Logs the user's weekly training schedule (e.g. Monday: Chest & Triceps) into session memory. |
| `list_workouts` | `category` (optional) | Queries the workout catalog for routines across Strength, Hypertrophy, Calisthenics, Conditioning, and Mobility. |
| `get_workout` | `workout_id` | Retrieves full exercise lists, sets, reps, rest periods, and execution guidance for a specific routine. |
| `get_fruit_nutrition` | `fruit_name` | Queries whole-food nutrition density (calories, protein, carbohydrates, fats, sugar) via verified USDA / public nutrition databases. |
| `get_recommended_habit` | `category` | Provides evidence-based micro-habits targeting Sleep, Hydration, Recovery, Mobility, Nutrition, and Mindset. |

---

## 4. Reactive UI Cards (A2UI Framework)

When tools execute, the agent streams structured JSON cards rendered before the natural language synthesis:

1. **`MacroCard`**: Displays BMR, TDEE, Target Calories, and interactive progress bars for Protein, Carbohydrate, and Fat targets.
2. **`WorkoutCard`**: Displays workout duration, intensity badge, muscle focus, and itemized exercise breakdowns (sets × reps).
3. **`WorkoutLogCard`**: Displays confirmed weekly split entries with muscle group chips and timestamp.
4. **`WorkoutListCard`**: Interactive program selector with category tags and difficulty levels.
5. **`HabitCard`**: Actionable wellness routine card with scientific rationale and implementation steps.
6. **`NutritionCard`**: Nutritional breakdown card for whole foods with macro percentages and calorie density.

---

## 5. Technology Stack

### Frontend Application (`fitcoach-ai`)
- **Framework**: Next.js 16 (App Router) with React 19
- **Styling**: Tailwind CSS v4 with bespoke Japanese *Kanso* monochromatic aesthetic (Off-white `#f8f7f5` in light mode, charcoal `neutral-900` / `#0a0a0a` in dark mode)
- **Animations**: Framer Motion 13 with custom cubic-bezier transitions (`[0.16, 1, 0.3, 1]`)
- **Icons**: Lucide React
- **Client Storage**: Browser `localStorage` sync (`fitcoach_messages`, `fitcoach_profile`, `fitcoach_workout_log`)
- **Hosting / Deploy**: Vercel

### Backend Agent (`fitcoach-wellness-agent`)
- **SDK**: Google Gen AI SDK (`@google/generative-ai` on Node.js / `google-genai` on Python)
- **Reasoning Models**: `gemini-3.5-flash`, `gemini-3.5-flash-lite`
- **Multimodal Generation**: `gemini-3.1-flash-lite-image` (Image Gen), `gemini-omni-flash-preview` (Video Gen)
- **Cloud Infrastructure**: Google Cloud Run (FastAPI A2A Proxy), Google Cloud Firestore, Vertex AI Agent Engine (`Reasoning Engine ID: 5331041500899835904`)

---

## 6. Environment & Configuration

```env
# Required for Next.js and API Route execution
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 7. Repository Layout

```
fitcoach-wellness-agent/
├── app/                        # Python ADK Agent Engine
│   ├── agent.py                # Tools, prompts, and memory bank callbacks
│   └── a2ui_utils.py           # A2UI card serialization
├── frontend/                   # Python FastAPI Cloud Run proxy
│   ├── main.py                 # A2A protocol router
│   └── Dockerfile              # Cloud Run container configuration
├── fitcoach-ai/                # Next.js 16 Web Application (Deployable to Vercel)
│   ├── app/                    # App router pages & API endpoints (/api/chat)
│   ├── components/             # Kanso UI components, visualizers & A2UI cards
│   ├── context/                # ThemeContext (dark/light mode)
│   ├── lib/                    # Tool definitions, memory sync, and macro calculator
│   ├── data/                   # Workout catalog & science-backed habits JSON
│   └── public/                 # Static assets & icons
├── project_brief.md            # Initial hackathon brief & goals
├── project_plan.md             # Technical scope & GCP resources
├── walkthrough.md              # Demonstration scripts & test cases
└── SPEC.md                     # This master specification document
```
