#!/bin/bash
git pull
NODE_ENV=production gulp build --release
pm2 restart scott-production
tailf /root/.pm2/logs/scott-production-out-0.log
