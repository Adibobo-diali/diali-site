#!/usr/bin/env bash
# Builds the hero breathing loop and the film posters from the opening run-out clip in $CLIPS.
# The film itself is built as frame atlases by scripts/build-frames.sh.
set -euo pipefail
CLIPS=${CLIPS:?set CLIPS to the folder with the clip mp4s}
OUT=public/film; mkdir -p $OUT public/video
# Hero breathing loop: the first 1.6 s of the run-out, forward then back.
for v in desktop:1280:720: mobile:540:960:crop=ih*9/16:ih,; do
  IFS=: read nm w h cr <<<"$v"
  ffmpeg -v error -y -t 1.6 -i $CLIPS/${FIRST:-v00-runout}.mp4 -filter_complex "[0:v]fps=24,${cr}scale=$w:$h:flags=lanczos,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[o]" -map "[o]" -an -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart public/video/hero_breathing_$nm.mp4
  ffmpeg -v error -y -i public/video/hero_breathing_$nm.mp4 -c:v libvpx-vp9 -b:v 0 -crf 38 -an public/video/hero_breathing_$nm.webm
  ffmpeg -v error -y -i $CLIPS/${FIRST:-v00-runout}.mp4 -frames:v 1 -vf "${cr}scale=$w:$h" -q:v 3 $OUT/home-poster-$nm.jpg
done
ls -la $OUT public/video
