
echo "[server] - build & push server image"
echo "[client] - build & push client image"

read value

if [ "$value" = "server" ]
then
    cd backend && docker build \
        . -f Dockerfile.prod -t pustinek/diplomska_server:latest && \
        docker push pustinek/diplomska_server:latest
elif [ "$value" = "client" ]
then
    cd client && docker build \
        . -f Dockerfile.prod -t pustinek/diplomska_client:latest && \
        docker push pustinek/diplomska_client:latest
else
    echo "wrong input, try again !"
fi


