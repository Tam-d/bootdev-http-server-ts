FROM ubuntu:24.04

WORKDIR /app

ARG GO_VERSION="go1.25.4"
ARG GO_URL="https://go.dev/dl/${GO_VERSION}.linux-amd64.tar.gz"

ARG BOOT_DEV_CLI_URL="github.com/bootdotdev/bootdev@latest"

ARG NVM_VERSION="0.39.7"
ARG NODE_VERSION="20"
ARG NVM_URL="https://raw.githubusercontent.com/nvm-sh/nvm/v${NVM_VERSION}/install.sh"

#install git
RUN apt update && apt install -y \
software-properties-common && \
add-apt-repository -y ppa:git-core/ppa && \
apt install -y git

RUN apt install -y curl

#install go
RUN curl -OL ${GO_URL} && \
    rm -rf /usr/local/go && \
    tar -C /usr/local -xzf ${GO_VERSION}.linux-amd64.tar.gz

ENV PATH=$PATH:/usr/local/go/bin

#install bootdev cli
RUN go install ${BOOT_DEV_CLI_URL}

ENV PATH=$PATH:/root/go/bin

# download and install nvm, node, npm
RUN curl -o- ${NVM_URL} | bash

SHELL ["/bin/bash", "--login", "-i", "-c"]

RUN nvm install ${NODE_VERSION} \
    # verifies the right Node.js version is in the environment
    && node -v \ 
    # verifies the right NPM version is in the environment
    && npm -v