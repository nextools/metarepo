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
    locales && \
  # fix "perl: warning: Setting locale failed"
  locale-gen en_US.UTF-8 && \
  #
  curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
  curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  #
  add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" && \
  add-apt-repository "deb [arch=amd64] https://deb.nodesource.com/node_10.x $(lsb_release -cs) main" && \
  add-apt-repository "deb [arch=amd64] https://dl.yarnpkg.com/debian/ stable main" && \
  #
  apt-get update && apt-get --no-install-recommends --yes install \
    docker-ce \
    nodejs \
    yarn && \
  #
  mkdir --mode 700 /root/.ssh /root/.gnupg && \
  printf '%%Assuan%%\nsocket=/ssh-agent-forward/S.gpg-agent\n' > /root/.gnupg/S.gpg-agent && \
  ssh-keyscan github.com >> /root/.ssh/known_hosts 2> /dev/null && \
  #
  apt-get autoremove --yes && \
  apt-get clean --yes && \
  rm -rf /var/lib/apt/lists/*

COPY .bashrc /root/.bashrc

ENV DEBIAN_FRONTEND=dialog
ENV SHELL /bin/bash
