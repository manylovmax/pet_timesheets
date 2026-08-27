#!/bin/sh
export PYTHONPATH="${PYTHONPATH}:/app"
cd /app/auth_service
python delete_old_tokens.py