# My agent: FitCoach & Wellness Assistant

**One-liner**: A conversational agent that helps active individuals track daily activities, calculate personalized calories/macros, and stay motivated with tailored visual progress cards.

### Tool Coverage:
- **Memory**: Remembers user profile (age, weight, height, activity level, fitness goals, dietary preferences, and logged activity history across sessions).
- **Tools**: `log_daily_activity(activity_type, duration_mins, intensity)`, `calculate_macros_and_bmr(weight_kg, height_cm, age, gender, activity_level, goal)`, `get_recommended_habit(category)`.
- **Catalog/UI**: Routine & Habit Cards (displaying daily target calories, protein/carb/fat macro breakdown, and completed activity summaries as structured cards).
- **Image Gen**: Generates personalized motivational poster visuals and healthy meal inspiration images (`gemini-3.1-flash-lite-image`).
- **Sandbox**: Executes python calculation scripts for Harris-Benedict BMR, TDEE, macro ratios, and weekly deficit/surplus projections.

**Core rails (everyone)**: memory, tools, eval, deploy, frontend  
**My stretch menu (pick later)**: A2UI Cards, Image Generation, Code Sandbox for macro calculations  
**First eval question**: "Given a 30-year-old female, 65kg, 170cm, moderate activity level aiming for weight maintenance, calculate daily BMR and TDEE and suggest a balanced macro ratio breakdown."
