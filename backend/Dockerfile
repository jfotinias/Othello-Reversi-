# Χρησιμοποιούμε την επίσημη ελαφριά εικόνα της Python
FROM python:3.11-slim

# Ορίζουμε τον φάκελο εργασίας στο container
WORKDIR /app

# Αντιγράφουμε και εγκαθιστούμε τις εξαρτήσεις
# Το requirements.txt πρέπει να βρίσκεται στο /backend/
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Αντιγραφή του υπόλοιπου κώδικα της εφαρμογής (server.py, Board.py, κλπ.)
COPY . .

# Έκθεση της θύρας 8000
EXPOSE 8000

# Ορίζουμε την εντολή εκκίνησης του Uvicorn
CMD ["sh", "-c", "uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}"]