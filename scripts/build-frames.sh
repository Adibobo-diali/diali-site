#!/usr/bin/env bash
# Builds the scroll-scrubbed film as frame atlases (6 frames per WebP, 3 x 2) from the clips in $CLIPS.
# Output: public/film/{home,conf}/{desktop,mobile}/atlas-NNN.webp and public/film/frames.json (frame counts).
# Usage: CLIPS=/path/to/clips bash scripts/build-frames.sh      (FPS and Q can be overridden)
set -euo pipefail
CLIPS=${CLIPS:?set CLIPS to the folder with the clip mp4s}
FPS=${FPS:-12}; Q=${Q:-82}
HOME_ORDER=${HOME_ORDER:-"v00-runout v01-tunnel v02-hub v04-to-workshop v08-open-workshop v03-to-tournament v07-open-tournament v05-to-scouting v09-open-scouting v06-to-conference v10-walkout v11-ending"}
CONF_ORDER=${CONF_ORDER:-"c13-doors-to-hall c14-hall-push c15-hall-back c16-doors-close c01-twenty-penalty"}
OUT=public/film
atlas() { # film order variant w h crop
  local film=$1 order=$2 var=$3 w=$4 h=$5 crop=$6 in="" fl="" n=0 cat=""
  for c in $order; do [ -f "$CLIPS/$c.mp4" ] || continue; in="$in -i $CLIPS/$c.mp4"; fl="$fl[$n:v]fps=$FPS,setsar=1[v$n];"; cat="$cat[v$n]"; n=$((n+1)); done
  local dir=$OUT/$film/$var; rm -rf "$dir"; mkdir -p "$dir"
  ffmpeg -v error -y $in -filter_complex "$fl${cat}concat=n=$n:v=1:a=0,${crop}scale=$w:$h:flags=lanczos,tile=3x2[o]" -map "[o]" \
    -c:v libwebp -quality $Q -start_number 0 "$dir/atlas-%03d.webp"
}
frames() { # total frame count at $FPS for the clips that exist
  local tot=0; for c in $1; do [ -f "$CLIPS/$c.mp4" ] || continue
    tot=$(python3 -c "print($tot + $(ffprobe -v error -show_entries format=duration -of csv=p=0 $CLIPS/$c.mp4))"); done
  python3 -c "import math; print(math.floor($tot * $FPS))"
}
segs() { for c in $1; do [ -f "$CLIPS/$c.mp4" ] && printf "%s %s\n" $c $(ffprobe -v error -show_entries format=duration -of csv=p=0 $CLIPS/$c.mp4); done; }
atlas home "$HOME_ORDER" desktop 1440 810 ""
atlas home "$HOME_ORDER" mobile 720 1280 "crop=ih*9/16:ih,"
atlas conf "$CONF_ORDER" desktop 1440 810 ""
atlas conf "$CONF_ORDER" mobile 720 1280 "crop=ih*9/16:ih,"
segs "$HOME_ORDER" > $OUT/home-segments.txt; segs "$CONF_ORDER" > $OUT/conf-segments.txt
printf '{"fps":%s,"home":%s,"conf":%s}\n' $FPS "$(frames "$HOME_ORDER")" "$(frames "$CONF_ORDER")" > $OUT/frames.json
cat $OUT/frames.json; du -sh $OUT/*/*
