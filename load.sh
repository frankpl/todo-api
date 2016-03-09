#!/bin/bash

curl -H "Content-Type: application/json;charset=utf-8" \
     -X POST -d '{ "description": "Eat my lunch", "completed": false }' \
     -S -s -o /dev/null http://localhost:3000/todos

curl -H "Content-Type: application/json;charset=utf-8" \
     -X POST -d '{ "description": "Walk the dog.", "completed": false }' \
     -S -s -o /dev/null http://localhost:3000/todos

curl -H "Content-Type: application/json;charset=utf-8" \
     -X POST -d '{ "description": "Feed the cat.", "completed": true }' \
     -S -s -o /dev/null http://localhost:3000/todos

curl -H "Content-Type: application/json;charset=utf-8" \
     -X POST -d '{ "description": "Bring home dinner.", "completed": false }' \
     -S -s -o /dev/null http://localhost:3000/todos

curl -H "Content-Type: application/json;charset=utf-8" \
     -X POST -d '{ "description": "Order a movie.", "completed": true }' \
     -S -s -o /dev/null http://localhost:3000/todos

