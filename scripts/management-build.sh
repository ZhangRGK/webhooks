#!/bin/sh

cd ../management
npm run build
pm2 restart xstar-management-fe
