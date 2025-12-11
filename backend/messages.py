import random
# ----------------------------------------------------
# 🐊 ΛΙΣΤΕΣ ΣΥΝΤΟΜΩΝ ΜΗΝΥΜΑΤΩΝ
# ----------------------------------------------------

AI_PLAY_MESSAGES = [
    "Εύκολη κίνηση.",
    "Δες αυτό.",
    "Κυριαρχία.",
    "Έπαιξα.",
    "Θα νικήσω σίγουρα",
    "Προβλέπεται εύκολη νίκη σήμερα",
    "Αν δεν αντέχεις την πίεση παρετήσου"
]

COMMENT_MOVE_MESSAGES = [
    "Ωραία",
    "Ενδιαφέρον!",
    "Καλά",
    "Χμμμ...",
    "..."

]

PASS_MESSAGES = [
    "Πάω πάσο",
    "Άσχημα τα πράγματα. Παίξε...",
    "Παίξε ξανά!",
]

INVALID_MOVE_MESSAGES = [
    "Μη έγκυρη κίνηση.",
    "Αυτό δεν επιτρέπεται.",
    "Δοκίμασε ξανά.",
    "Απλά όχι.",
    "Δεν μπορείς να παίξεις εκεί.",
    "Μα καλά ξέρεις να παίζεις;",
    "Νουμπά"
]

WIN_MESSAGES = [
    "Νίκη! Ήταν δίκαιο.",
    "Τέλος! Χαμός.",
    "Αναμενόμενο αποτέλεσμα.",
    "Κανένας αντίλογος.",
]

LOSE_MESSAGES = [
    "Αδύνατον!",
    "Δεν το περίμενα.",
    "Θα επιστρέψω πιο δυνατός",
]

# ----------------------------------------------------
# 🐊 ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ (ίδιες όπως πριν)
# ----------------------------------------------------

def get_ai_play_message():
    """Επιστρέφει ένα τυχαίο μήνυμα όταν ο AI παίζει."""
    return random.choice(AI_PLAY_MESSAGES)

def get_comment_move_message():
    """Επιστρέφει ένα τυχαίο μονολεκτικό σχόλιο για την κίνηση του ανθρώπου."""
    return random.choice(COMMENT_MOVE_MESSAGES)

def get_pass_message():
    """Επιστρέφει ένα τυχαίο μήνυμα όταν ο χρήστης αναγκάζεται να περάσει."""
    return random.choice(PASS_MESSAGES)

def get_invalid_move_message():
    """Επιστρέφει ένα τυχαίο μήνυμα όταν ο χρήστης προσπαθεί μη έγκυρη κίνηση."""
    return random.choice(INVALID_MOVE_MESSAGES)

def get_win_message():
    """Επιστρέφει ένα τυχαίο μήνυμα νίκης του AI."""
    return random.choice(WIN_MESSAGES)

def get_lose_message():
    """Επιστρέφει ένα τυχαίο μήνυμα ήττας του AI."""
    return random.choice(LOSE_MESSAGES)

def get_message_for_end_game(ai_score: int, human_score: int):
    if ai_score > human_score:
        # Κέρδισε ο AI
        return get_win_message()
    elif human_score > ai_score:
        # Έχασε ο AI (Κέρδισε ο άνθρωπος)
        return get_lose_message()
    else:
        # Ισοπαλία
        return "Ισοπαλία."