# Project Plan: FitCoach AI — Personal Wellness Assistant

## Overview
FitCoach AI is an intelligent fitness and wellness coach built on Google's Agent Development Kit (ADK) and deployed to Vertex AI Agent Engine / Agent Runtime.

## Technical Scope & Architecture

1. **ADK Agent Engine (`app/agent.py`)**:
   - Model: `gemini-flash-latest` with `gemini-3.1-flash-lite-image` for images and `gemini-omni-flash-preview` for exercise video generation.
   - Core capabilities: Memory Bank integration, Firestore workout catalog, BMR/Macro engine, A2UI dynamic surfaces, GCS public media bucket integration.

2. **Frontend UI Proxy (`frontend/`)**:
   - FastAPI server with Agent-to-Agent (A2A) protocol forwarding.
   - Deployed on Google Cloud Run with responsive teal UI design, quick prompt chips, and A2UI surface renderer.

3. **Cloud Resources**:
   - GCP Region: `us-east1`
   - Firestore Project: `qwiklabs-gcp-02-144a03bc65ca` (Collection: `workouts`)
   - Cloud Storage Bucket: `gs://fitcoach-wellness-media-84920`
   - Reasoning Engine Resource ID: `5331041500899835904`

4. **Verification & Testing**:
   - ADK evaluation datasets and local test suite.
   - Interactive demo walkthrough recorded in `walkthrough.md`.
