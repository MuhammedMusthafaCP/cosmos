FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Vite inlines VITE_* vars at build time. Override with --build-arg.
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

# Firebase web config. Placeholders by default; override with --build-arg.
ARG VITE_FIREBASE_API_KEY=x
ARG VITE_FIREBASE_AUTH_DOMAIN=x.firebaseapp.com
ARG VITE_FIREBASE_PROJECT_ID=x
ARG VITE_FIREBASE_STORAGE_BUCKET=x.appspot.com
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=0
ARG VITE_FIREBASE_APP_ID=1:0:web:0
ARG VITE_FIREBASE_MEASUREMENT_ID=G-0
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
    VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID

RUN npx vite build

FROM nginx:alpine
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  location / { try_files $uri /index.html; }\n}\n' > /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
