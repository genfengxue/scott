#!/bin/bash
git pull
NODE_ENV=test gulp build --release
pm2 restart scott-test
tailf ~/.pm2/logs/scott-test-out-1.log
