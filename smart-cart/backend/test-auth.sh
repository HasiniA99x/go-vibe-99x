#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Testing Authentication Endpoints"
echo "==============================="

# Test Register
echo -e "\n${GREEN}Testing Register Endpoint${NC}"
curl -X POST "${BASE_URL}/auth/register" \
-H "Content-Type: application/json" \
-d '{
    "email": "test@example.com",
    "password": "password123"
}'

# Wait for 2 seconds
sleep 2

echo -e "\n\n${GREEN}Testing Login Endpoint${NC}"
curl -X POST "${BASE_URL}/auth/login" \
-H "Content-Type: application/json" \
-d '{
    "email": "test@example.com",
    "password": "password123"
}'

echo -e "\n" 