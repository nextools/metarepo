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
    gnupg-agent \
    software-properties-common \
    locales

# fix "perl: warning: Setting locale failed"
RUN locale-gen en_US.UTF-8

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
RUN curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -

RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
RUN add-apt-repository "deb [arch=amd64] https://deb.nodesource.com/node_10.x $(lsb_release -cs) main"
RUN add-apt-repository "deb [arch=amd64] https://dl.yarnpkg.com/debian/ stable main"
RUN apt-get update
RUN apt-get --no-install-recommends --yes install docker-ce nodejs yarn

# RUN groupadd dev \
#     && useradd --create-home --gid dev dev \
#     && chown --recursive dev:dev /home/dev/
# USER dev

# RUN apt-get autoremove --yes && apt-get clean --yes

ENV DEBIAN_FRONTEND=dialog
