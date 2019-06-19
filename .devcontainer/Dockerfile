FROM ubuntu:bionic

# fix "debconf: unable to initialize frontend: Dialog"
ENV DEBIAN_FRONTEND=noninteractive
# fix "Warning: apt-key output should not be parsed (stdout is not a terminal)"
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn

RUN apt-get update && apt-get --no-install-recommends --yes install \
    apt-utils \
    curl \
    git \
    procps \
    ca-certificates \
    openssh-client \
    gnupg-agent \
    software-properties-common \
    locales

# fix "perl: warning: Setting locale failed"
RUN locale-gen en_US.UTF-8

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
RUN curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -

RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
RUN add-apt-repository "deb [arch=amd64] https://deb.nodesource.com/node_10.x $(lsb_release -cs) main"
RUN add-apt-repository "deb [arch=amd64] https://dl.yarnpkg.com/debian/ stable main"

RUN apt-get update && apt-get --no-install-recommends --yes install \
    docker-ce \
    nodejs \
    yarn

# RUN apt-get autoremove --yes && apt-get clean --yes

# https://wiki.gnupg.org/NFS
RUN mkdir --mode 700 /root/.ssh /root/.gnupg && \
    printf '%%Assuan%%\nsocket=/ssh-agent-forward/S.gpg-agent\n' > /root/.gnupg/S.gpg-agent && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts 2> /dev/null

ENV DEBIAN_FRONTEND=dialog
ENV SHELL /bin/bash
