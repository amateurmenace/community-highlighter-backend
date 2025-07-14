import subprocess
import os

video_path = "outputs/video.mp4"
srt_path = "outputs/subtitles.srt"

# Run whisper to transcribe audio and save to subtitles.srt
subprocess.run([
    "whisper", video_path,
    "--output_format", "srt",
    "--output_dir", "outputs",
    "--fp16", "False"
])

# Rename default output to subtitles.srt
base_output = os.path.splitext(os.path.basename(video_path))[0]
original_srt = f"outputs/{base_output}.srt"

if os.path.exists(original_srt):
    os.rename(original_srt, srt_path)
    print("✅ Transcription complete.")
else:
    print("❌ No subtitles found.")