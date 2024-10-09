FROM mongo:latest
WORKDIR /
COPY ./docker-entrypoint-initdb.d ./docker-entrypoint-initdb.d
COPY ./secrets ./run/secrets
ENV MONGO_INITDB_ROOT_USERNAME_FILE=/run/secrets/mongo_username.txt
ENV MONGO_INITDB_ROOT_PASSWORD_FILE=/run/secrets/mongo_password.txt