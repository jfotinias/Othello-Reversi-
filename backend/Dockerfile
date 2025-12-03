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

# Ορίζουμε την εντολή εκκίνησης του Uvicorn
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]