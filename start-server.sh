#!/usr/bin/env bash

# Start or restart Firebase emulators for functions and hosting
if pgrep -f "firebase.*emulators:start" > /dev/null; then
  echo "Restarting Firebase emulators..."
  pkill -f "firebase.*emulators:start"
else
  echo "Starting Firebase emulators..."
fi

npx firebase emulators:start --only functions,hosting
