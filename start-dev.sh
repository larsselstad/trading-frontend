#!/bin/zsh -i
set -e

nvm install
nvm use
npm install
npm run dev
