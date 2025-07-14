import json
from moviepy.editor import VideoFileClip

clip = VideoFileClip("outputs/video.mp4")
print(json.dumps({
    "duration": round(clip.duration, 2),
    "fps": clip.fps,
    "width": clip.w,
    "height": clip.h
}))