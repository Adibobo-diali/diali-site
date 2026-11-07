#!/usr/bin/env bash
# DIALI film grade: one look for every still, poster and clip.
# black point #050a1a, highlights toward #f2d98a, greens -25%, 4% grain.
# Usage: grade.sh <in> <out> [extra-prefilter]
set -euo pipefail
in="$1"; out="$2"; pre="${3:-null}"
BASE="huesaturation=saturation=-0.25:colors=g:strength=1,huesaturation=saturation=-0.12:colors=c,curves=r='0/0.020 0.5/0.49 1/0.975':g='0/0.039 0.5/0.47 1/0.93':b='0/0.102 0.5/0.47 1/0.80',eq=saturation=0.92"
GRAIN="${GRAIN:-null}"  # grain is a shared CSS overlay on the site; set GRAIN=noise=alls=10:allf=t to bake it in
ffmpeg -v error -y -i "$in" -vf "${pre},${BASE},${GRAIN}" "${@:4}" "$out"
