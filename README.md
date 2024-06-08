Docker container ls -a 
docker start redis-stack
docker exec -it 0d2b6534472d bash 
redis-cli 


docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
docker exec -it docker-id bash 