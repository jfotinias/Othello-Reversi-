# Stage 1: Build της Angular εφαρμογής
FROM node:20 as build

WORKDIR /app

# 1. Αντιγράφουμε τα αρχεία package και τρέχουμε npm install
COPY package.json package-lock.json ./
RUN npm install

# 2. Αντιγραφή ΟΛΩΝ των αρχείων για το build
COPY . .

# 3. Build για παραγωγή (production)
RUN npm run build --configuration=production

# Stage 2: Σερβίρισμα των στατικών αρχείων με Nginx
FROM nginx:alpine

# 1. Κάνουμε COPY το δικό μας αρχείο ρυθμίσεων Nginx
# ΠΡΟΣΟΧΗ: Αυτό το αρχείο πρέπει να υπάρχει στον φάκελο othello-ui
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 2. ΑΝΤΙΓΡΑΦΗ ΤΗΣ ΕΦΑΡΜΟΓΗΣ: Χρησιμοποιούμε τη ρίζα του build output (dist)
# Αυτό είναι το /app/dist, που σημαίνει ο φάκελος dist μέσα στο othello-ui
COPY --from=build /app/dist/othello-ui/browser /usr/share/nginx/html

EXPOSE 80