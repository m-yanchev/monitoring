FROM node
USER node
WORKDIR /home/node/app
ENV NODE_ENV=production
EXPOSE 3000
COPY ./.next/standalone .
COPY ./.next/static ./.next/static
COPY ./public ./public
CMD ["node", "./server.js"]