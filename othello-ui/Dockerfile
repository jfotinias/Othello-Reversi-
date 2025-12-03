# Stage 1: Build της Angular εφαρμογής
FROM node:20 as build

WORKDIR /app

# Αντιγράφουμε τα αρχεία package και τρέχουμε npm install
COPY package.json package-lock.json ./
RUN npm install

# Αντιγραφή του κώδικα και build για παραγωγή (production)
COPY . .
RUN npm run build --configuration=production

# Stage 2: Σερβίρισμα των στατικών αρχείων με Nginx
FROM nginx:alpine

# ΔΙΟΡΘΩΣΗ 1: Απλά ο φάκελος dist
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80