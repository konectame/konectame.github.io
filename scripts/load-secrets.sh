#!/bin/bash

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Error: .env file not found!"
    exit 1
fi

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed. Please install it first:"
    echo "https://cli.github.com/"
    exit 1
fi

# Check if logged in to GitHub
if ! gh auth status &> /dev/null; then
    echo "Error: Not logged in to GitHub. Please run 'gh auth login' first."
    exit 1
fi

# Read .env file and set each variable as a secret
while IFS='=' read -r key value || [ -n "$key" ]; do
    # Skip empty lines and comments
    if [ -z "$key" ] || [[ $key == \#* ]]; then
        continue
    fi
    
    # Remove any quotes from the value
    value=$(echo "$value" | tr -d '"' | tr -d "'")
    
    # Trim whitespace
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)
    
    if [ ! -z "$key" ] && [ ! -z "$value" ]; then
        echo "Setting secret: $key"
        echo "$value" | gh secret set "$key"
    fi
done < ".env"

echo "All secrets have been set successfully!"
