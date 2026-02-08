#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

for ((i=1; i<=$1; i++)); do
  result=$(opencode run "@requirements.md @progress.md \
  1. Read the requirements.md and progress.md files. \
  2. Find the next incomplete task and implement it. \
  3. Update progress.md with what you did. \
  4. Ensure the codebase is stable by successfully running all automated tests, static type-checks, and the production build process according to the project's specific toolchain. \
  5. Commit your changes. \
  ONLY DO ONE TASK AT A TIME. \
  If the progress is complete, output <promise>COMPLETE</promise>." -m "opencode/gemini-3-flash")

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "Complete after $i iterations."
    exit 0
  fi
done