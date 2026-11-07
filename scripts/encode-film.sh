#!/usr/bin/env bash
# Builds the scroll-scrubbed film videos from the Higgsfield clips in $CLIPS.
# Short GOP (a keyframe every 6 frames) so seeking on scroll stays smooth.
# Output: public/film/home-{desktop,mobile}.mp4, conf-{desktop,mobile}.mp4, and the hero breathing loop.
set -euo pipefail
CLIPS=${CLIPS:?set CLIPS to the folder with the clip mp4s}
OUT=public/film; mkdir -p $OUT public/video
HOME_ORDER="v01-tunnel v02-hub v04-to-workshop v08-open-workshop v03-to-tournament v07-open-tournament v05-to-scouting v09-open-scouting v06-to-conference v10-walkout v11-ending"
CONF_ORDER="c13-doors-to-hall c14-hall-push c15-hall-back c16-doors-close c01-twenty-penalty"
enc() { # name order w h crop
  local name=$1 order=$2 w=$3 h=$4 crop=$5 in="" fl="" n=0
  for c in $order; do in="$in -i $CLIPS/$c.mp4"; fl="$fl[$n:v]fps=24,${crop}scale=$w:$h:flags=lanczos,setsar=1[v$n];"; n=$((n+1)); done
  local cat=""; for i in $(seq 0 $((n-1))); do cat="$cat[v$i]"; done
  ffmpeg -v error -y $in -filter_complex "$fl${cat}concat=n=$n:v=1:a=0[o]" -map "[o]" -an \
    -c:v libx264 -preset slow -crf ${CRF:-31} -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart $OUT/$name.mp4
}
enc home-desktop "$HOME_ORDER" 1280 720 ""
CRF=30 enc home-mobile "$HOME_ORDER" 540 960 "crop=ih*9/16:ih,"
if [ -f $CLIPS/c16-doors-close.mp4 ]; then
  enc conf-desktop "$CONF_ORDER" 1280 720 ""
  CRF=30 enc conf-mobile "$CONF_ORDER" 540 960 "crop=ih*9/16:ih,"
fi
# Segment start times (seconds) for film.yaml
for c in $HOME_ORDER; do printf "%s %s\n" $c $(ffprobe -v error -show_entries format=duration -of csv=p=0 $CLIPS/$c.mp4); done > $OUT/home-segments.txt
[ -f $CLIPS/c16-doors-close.mp4 ] && for c in $CONF_ORDER; do printf "%s %s\n" $c $(ffprobe -v error -show_entries format=duration -of csv=p=0 $CLIPS/$c.mp4); done > $OUT/conf-segments.txt
# Hero breathing loop: the first 1.6 s of the tunnel flight, forward then back.
for v in desktop:1280:720: mobile:540:960:crop=ih*9/16:ih,; do
  IFS=: read nm w h cr <<<"$v"
  ffmpeg -v error -y -t 1.6 -i $CLIPS/v01-tunnel.mp4 -filter_complex "[0:v]fps=24,${cr}scale=$w:$h:flags=lanczos,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[o]" -map "[o]" -an -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart public/video/hero_breathing_$nm.mp4
  ffmpeg -v error -y -i public/video/hero_breathing_$nm.mp4 -c:v libvpx-vp9 -b:v 0 -crf 38 -an public/video/hero_breathing_$nm.webm
  ffmpeg -v error -y -i $CLIPS/v01-tunnel.mp4 -frames:v 1 -vf "${cr}scale=$w:$h" -q:v 3 $OUT/home-poster-$nm.jpg
done
ls -la $OUT public/video
