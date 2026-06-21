#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-https://github.com/Rustyadj/ICFtakeoff.git}"
BRANCH="${BRANCH:-main}"

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO"
else
  git remote add origin "$REPO"
fi

git push -u origin "$BRANCH"

echo "Published to https://github.com/Rustyadj/ICFtakeoff"
