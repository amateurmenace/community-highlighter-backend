import os
from moviepy.editor import VideoFileClip, concatenate_videoclips
from moviepy.video.tools.subtitles import SubtitlesClip
from moviepy.video.fx.all import resize
from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_subclip

VIDEO_PATH = "outputs/video.mp4"
SRT_PATH = "outputs/subtitles.srt"
HIGHLIGHT_PATH = "outputs/highlight.mp4"

# Load video
video = VideoFileClip(VIDEO_PATH)

# Select highlight time ranges (example: 5 x 5-second clips evenly spaced)
duration = video.duration
highlight_times = [
    (duration * 0.1, duration * 0.1 + 5),
    (duration * 0.3, duration * 0.3 + 5),
    (duration * 0.5, duration * 0.5 + 5),
    (duration * 0.7, duration * 0.7 + 5),
    (duration * 0.9, duration * 0.9 + 5),
]

# Trim highlights
clips = []
for start, end in highlight_times:
    if end <= duration:
        clips.append(video.subclip(start, end))

final = concatenate_videoclips(clips)

# Write the highlight video
final.write_videofile(HIGHLIGHT_PATH, codec="libx264", audio_codec="aac")
print("✅ Highlight reel saved.")