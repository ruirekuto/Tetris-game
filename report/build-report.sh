#!/bin/zsh
set -euo pipefail

export TEXMFCACHE=/tmp/texmf-var
export TEXMFVAR=/tmp/texmf-var

mkdir -p "$TEXMFCACHE" "$TEXMFVAR"

lualatex -interaction=nonstopmode -halt-on-error report.tex
lualatex -interaction=nonstopmode -halt-on-error report.tex
