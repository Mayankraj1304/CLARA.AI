#!/bin/bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Starting backend..."
(
    cd "$ROOT_DIR/backend"
    npm run dev
) &

BACKEND_PID=$!

echo "Starting frontend..."
(
    cd "$ROOT_DIR/frontend"
    npm run dev
) &

FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

wait



# "chmod +x run.sh" ----> to make this file executable 