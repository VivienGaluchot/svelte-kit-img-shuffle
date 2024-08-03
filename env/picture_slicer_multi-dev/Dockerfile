FROM debian:11

# add dev tools
RUN apt-get update && \
    apt-get install git vim sudo bash-completion wget -y

# add dev user
RUN useradd -m dev && echo "dev:dev" | chpasswd && adduser dev sudo
USER dev
WORKDIR /home/dev
RUN echo "alias ll='ls -l'" >> .bashrc

# install node
ENV NODE_VERSION=22.5.1
RUN wget -O - https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
ENV NVM_DIR=/home/dev/.nvm
RUN . "$NVM_DIR/nvm.sh" && \
    nvm install ${NODE_VERSION} && \
    nvm use v${NODE_VERSION} && \
    nvm alias default v${NODE_VERSION} && \
    nvm install-latest-npm
ENV PATH="/home/dev/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

ENTRYPOINT ["bash"]
