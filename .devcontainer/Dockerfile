FROM bitnami/minideb:stretch

# fix "debconf: unable to initialize frontend: Dialog"
ENV DEBIAN_FRONTEND=noninteractive
# fix "Warning: apt-key output should not be parsed (stdout is not a terminal)"
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn

RUN apt-get update && apt-get --no-install-recommends --yes install \
    dialog \
    apt-utils \
    apt-transport-https \
    curl \
    git \
    procps \
    ca-certificates \
    gnupg2 \
    openssh-client \
    locales && \
  # fix "perl: warning: Setting locale failed"
  localedef --inputfile en_US --charmap UTF-8 en_US.UTF-8 && \
  #
  curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
  curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  #
  echo "deb https://download.docker.com/linux/debian stretch stable" | tee /etc/apt/sources.list.d/docker.list && \
  echo "deb https://deb.nodesource.com/node_10.x stretch main" | tee /etc/apt/sources.list.d/nodejs.list && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
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
ENV LC_ALL=en_US.UTF-8 LANGUAGE=en_US.UTF-8
ENV SHELL=/bin/bash
