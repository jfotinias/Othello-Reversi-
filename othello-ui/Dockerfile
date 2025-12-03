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

# Αντιγράφουμε τα έτοιμα αρχεία build στην τοποθεσία του Nginx
# Υποθέτουμε ότι ο output folder του Angular build είναι /dist/othello-ui/
COPY --from=build /app/dist/othello-ui /usr/share/nginx/html

EXPOSE 80