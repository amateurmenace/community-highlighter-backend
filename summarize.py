import os
from openai import OpenAI

TRANSCRIPT_PATH = "outputs/subtitles.srt"
SUMMARY_PATH = "outputs/summary.txt"

# Load transcript
with open(TRANSCRIPT_PATH, "r") as f:
    transcript = f.read()

# Get API key from environment
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("Missing OPENAI_API_KEY environment variable")

client = OpenAI(api_key=api_key)

# Request summary from GPT-4
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You summarize community meetings."},
        {"role": "user", "content": f"Summarize this meeting in 3 sentences:\n{transcript}"}
    ]
)

summary = response.choices[0].message.content.strip()

# Save summary
with open(SUMMARY_PATH, "w") as f:
    f.write(summary)

print("✅ Summary saved.")