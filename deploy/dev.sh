npm install
npm run build

rsync -rav --delete --exclude-from=.excludes ./ ubuntu@izysearch:/home/ubuntu/izysearch-frontend 
