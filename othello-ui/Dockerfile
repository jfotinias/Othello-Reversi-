# Stage 1: Build της Angular εφαρμογής
FROM node:20 as build

WORKDIR /app

# 1. Αντιγράφουμε τα αρχεία package και τρέχουμε npm install
COPY package.json package-lock.json ./
RUN npm install

# 2. Αντιγραφή ΟΛΩΝ των αρχείων για το build
# Αυτό περιλαμβάνει τα src, angular.json, tsconfig.json, κλπ.
COPY . .

# 3. Build για παραγωγή (production)
# Αν το build αποτύχει, δεν θα δημιουργηθεί ο φάκελος dist.
RUN npm run build --configuration=production

# Stage 2: Σερβίρισμα των στατικών αρχείων με Nginx
FROM nginx:alpine

# Χρησιμοποιούμε την πιο πιθανή διαδρομή, αφού επιδιορθώσαμε το build
COPY --from=build /app/dist/othello-ui /usr/share/nginx/html

EXPOSE 80