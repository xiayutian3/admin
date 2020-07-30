#!/bin/bash
echo "start updateing frontend..."
cd /usr/readHtml
echo "updating source..."
git pull
echo "frontend building..."
npm i
npm run build
echo "frontend publish..."
rm -rf /usr/readHtml/dist
mv dist /usr/readHtml
echo "finish updating frontend"