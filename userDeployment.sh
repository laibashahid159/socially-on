#!/bin/bash
echo "Fetcing from git"
git fetch origin master
echo "Removing Cache"
rm -rf .eslintcache
echo "Merging with master"
git pull origin master
echo "updating node modules"
npm install
echo "Build Application"
npm run build
echo "killing previous server"
pm2 delete "on-so-user-web"
echo "Starting up the new server"
pm2 start server.js --name "on-so-user-web"
pm2 list