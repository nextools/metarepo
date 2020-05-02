FROM ubuntu:bionic

# fix `debconf: unable to initialize frontend: Dialog`
ENV DEBIAN_FRONTEND=noninteractive
# fix `apt-key output should not be parsed (stdout is not a terminal)`
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

RUN apt-get update \
    # https://github.com/phusion/baseimage-docker/issues/319
    && apt-get install --yes apt-utils 2>&1 | grep -v "debconf: delaying package configuration, since apt-utils is not installed" \
    && apt-get --no-install-recommends --yes install \
      apt-transport-https \
      curl \
      git \
      procps \
      ca-certificates \
      gnupg2 \
      openssh-client \
    #
    && curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - \
    && curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    #
    && echo "deb https://download.docker.com/linux/ubuntu bionic stable" | tee /etc/apt/sources.list.d/docker.list \
    && echo "deb https://deb.nodesource.com/node_12.x bionic main" | tee /etc/apt/sources.list.d/nodejs.list \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    #
    && apt-get update \
    && apt-get --no-install-recommends --yes install \
      docker-ce \
      nodejs \
      yarn \
    #
    && mkdir --mode 700 /root/.ssh /root/.gnupg \
    && printf '%%Assuan%%\nsocket=/ssh-agent-forward/S.gpg-agent\n' > /root/.gnupg/S.gpg-agent \
    && ssh-keyscan github.com >> /root/.ssh/known_hosts 2> /dev/null \
    #
    && apt-get autoremove --yes \
    && apt-get clean --yes \
    && rm -rf /var/lib/apt/lists/*

COPY .bashrc /root/.bashrc

ENV DEBIAN_FRONTEND=dialog
ENV SHELL=/bin/bash
