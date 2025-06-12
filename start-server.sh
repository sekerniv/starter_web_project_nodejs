#!/usr/bin/env bash

# Start or restart the development server that connects to production Firestore
if pgrep -f "node server.js" > /dev/null; then
  echo "Restarting Node server..."
  pkill -f "node server.js"
else
  echo "Starting Node server..."
fi

node server.js
