#!/bin/sh

# based on https://github.com/uber-common/docker-ssh-agent-forward

IMAGE_NAME=uber/ssh-agent-forward:latest
CONTAINER_NAME=ssh-agent-forward
VOLUME_NAME=ssh-agent-forward
HOST_IP=127.0.0.1
HOST_PORT=2244
AUTHORIZED_KEYS=$(ssh-add -L | base64 | tr -d '\n')
GPG_SOCKET=$(gpgconf --list-dir agent-extra-socket)

docker rm -f "${CONTAINER_NAME}" > /dev/null 2>&1

docker volume create --name "${VOLUME_NAME}" > /dev/null

docker run \
  --name "${CONTAINER_NAME}" \
  -e "AUTHORIZED_KEYS=${AUTHORIZED_KEYS}" \
  -v "${VOLUME_NAME}:/ssh-agent" \
  -d \
  -p "${HOST_PORT}:22" \
  "${IMAGE_NAME}" > /dev/null

if [ "${DOCKER_HOST}" ]; then
  HOST_IP=$(echo "$DOCKER_HOST" | awk -F '//' '{print $2}' | awk -F ':' '{print $1}')
fi

while true; do
  ssh \
    -q \
    -o "UserKnownHostsFile=/dev/null" \
    -o "StrictHostKeyChecking=no" \
    -o "LogLevel=ERROR" \
    -p "${HOST_PORT}" \
    "root@${HOST_IP}" \
    exit

  if [ $? -eq 0 ]; then
    break
  fi

  sleep 1
done

ssh \
  -A \
  -f \
  -o "UserKnownHostsFile=/dev/null" \
  -o "StrictHostKeyChecking=no" \
  -o "StreamLocalBindUnlink=yes" \
  -o "LogLevel=ERROR" \
  -p "${HOST_PORT}" \
  -S none \
  -R "/ssh-agent/S.gpg-agent:${GPG_SOCKET}" \
  "root@${HOST_IP}" \
  /ssh-entrypoint.sh

echo "done"
