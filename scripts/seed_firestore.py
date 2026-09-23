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

"""Seed script to populate Firestore 'workouts' collection for FitCoach Agent."""

from google.cloud import firestore

# HARDCODED PROJECT ID (DO NOT read from env or google.auth.default to prevent Agent Platform project number issue)
PROJECT_ID = "qwiklabs-gcp-02-144a03bc65ca"
COLLECTION_NAME = "workouts"

SEED_WORKOUTS = [
    {
        "id": "chest_triceps_hypertrophy",
        "title": "Chest & Triceps Hypertrophy",
        "category": "Strength",
        "target_muscles": ["Chest", "Triceps", "Front Delts"],
        "duration_mins": 45,
        "difficulty": "Intermediate",
        "description": "Barbell bench press, incline dumbbell press, dips, and cable tricep pushdowns focused on upper body growth.",
        "calories_burned_est": 380,
    },
    {
        "id": "back_biceps_power",
        "title": "Back & Biceps Power Builder",
        "category": "Strength",
        "target_muscles": ["Lats", "Rhomboids", "Biceps"],
        "duration_mins": 50,
        "difficulty": "Intermediate",
        "description": "Deadlifts, lat pulldowns, bent-over rows, and incline EZ-bar curls to build a strong back and biceps.",
        "calories_burned_est": 420,
    },
    {
        "id": "legs_core_blast",
        "title": "Legs & Core Blast",
        "category": "Strength",
        "target_muscles": ["Quadriceps", "Hamstrings", "Glutes", "Abs"],
        "duration_mins": 60,
        "difficulty": "Advanced",
        "description": "Back squats, Romanian deadlifts, walking lunges, and hanging leg raises for lower body strength and core stability.",
        "calories_burned_est": 510,
    },
    {
        "id": "hiit_cardio_burner",
        "title": "HIIT Full-Body Cardio Burner",
        "category": "Cardio",
        "target_muscles": ["Full Body", "Cardiovascular System"],
        "duration_mins": 30,
        "difficulty": "All Levels",
        "description": "High-intensity interval training combining kettlebell swings, burpees, mountain climbers, and jump rope intervals.",
        "calories_burned_est": 350,
    },
    {
        "id": "active_recovery_flow",
        "title": "Active Recovery & Mobility Flow",
        "category": "Flexibility",
        "target_muscles": ["Hips", "Hamstrings", "Shoulders", "Spine"],
        "duration_mins": 25,
        "difficulty": "Beginner",
        "description": "Gentle mobility drills, hip openers, dynamic stretches, and foam rolling for muscle recovery and joint health.",
        "calories_burned_est": 120,
    },
]


def seed():
    print(f"Connecting to Firestore for project: '{PROJECT_ID}'...")
    db = firestore.Client(project=PROJECT_ID)
    collection_ref = db.collection(COLLECTION_NAME)

    for item in SEED_WORKOUTS:
        doc_id = item["id"]
        doc_ref = collection_ref.document(doc_id)
        doc_ref.set(item)
        print(f"  ✓ Seeded document: {doc_id} ('{item['title']}')")

    print(f"\nSuccessfully seeded {len(SEED_WORKOUTS)} items into collection '{COLLECTION_NAME}'!")


if __name__ == "__main__":
    seed()
