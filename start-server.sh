#!/usr/bin/env bash

# Start or restart the Node.js server

# Attempt to kill any running instance of server.js
if pgrep -f "node\s*server.js" > /dev/null; then
  echo "Restarting existing server..."
  pkill -f "node\s*server.js"
else
  echo "Starting server..."
fi

# Start the server in the background
node server.js &


