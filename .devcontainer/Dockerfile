FROM node:24

ARG USER_UID=1000
ARG USER_GID=1000
ARG USERNAME=node

RUN groupmod -g ${USER_GID} ${USERNAME} \
    && usermod -u ${USER_UID} -g ${USER_GID} ${USERNAME} \
    && chown -R ${USER_UID}:${USER_GID} /home/${USERNAME}

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

WORKDIR /workspace

RUN  chown -R ${USER_UID}:${USER_GID} /workspace

USER ${USERNAME}