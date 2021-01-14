# Best practices for development, and not for a production deployment
# from https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# Build: run ooni-sysadmin.git/scripts/docker-build from this directory

FROM node:erbium

# BEGIN root
USER root
RUN groupmod -g 1007 node && usermod -u 1007 -g 1007 node
COPY . /usr/src/app
RUN set -ex \
    && chown -R node:node /usr/src/app \
    && :

# END root

USER node
WORKDIR /usr/src/app

# .cache removal leads to two times smaller image and 
RUN set -ex \
    && yarn install --frozen-lockfile \
    && yarn run build:next \
    && rm -rf /home/node/.cache \
    && :

EXPOSE 3000

CMD [ "yarn", "run", "start" ]
