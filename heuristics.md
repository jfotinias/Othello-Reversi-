🎯 **Othello AI — Οδηγίες Ευρετικών & Καταμερισμός Εργασιών**

Project: Intelligent Othello Agent using Minimax / Alpha-Beta


📌 **Στόχος**

Κάθε μέλος της ομάδας αναλαμβάνει να υλοποιήσει διαφορετική ευρετική συνάρτηση evaluate() για το παιχνίδι Othello, ώστε να συγκρίνουμε τις επιδόσεις τους μέσα από Minimax.

Όλες οι ευρετικές θα υλοποιηθούν μέσα στην κλάση Board και θα δοκιμαστούν στις ίδιες test positions.


🧩 **Ευρετικές που θα υλοποιηθούν**

1️⃣ **Heuristic A** — Piece Difference (Basic)

Υπεύθυνος: Mike

Μετράει πόσα κομμάτια έχει ο παίκτης - πόσα έχει ο αντίπαλος.

score = (#player_pieces) – (#opponent_pieces)

<u>Πλεονεκτήματα:</u>
-Απλή
-Γρήγορη

<u>Μειονεκτήματα:</u>
-Αδύναμη στο early game
-Δεν κατανοεί σημαντικές θέσεις του ταμπλό


2️⃣ **Heuristic B** — Weighted Squares (3-2-1)

Υπεύθυνος: Chris

Χρησιμοποιεί έναν πίνακα βαρών για να δώσει μεγαλύτερη σημασία στις γωνίες και στα edges.

🔢 Προτεινόμενος πίνακας βαρών
```
	0	1	2	3	4	5	6	7
  ________________________________  
0 |	3	2	2	2	2	2	2	3
1 |	2	1	1	1	1	1	1	2
2 |	2	1	1	1	1	1	1	2
3 |	2	1	1	1	1	1	1	2
4 |	2	1	1	1	1	1	1	2
5 |	2	1	1	1	1	1	1	2
6 |	2	1	1	1	1	1	1	2
7 |	3	2	2	2	2	2	2	3
```

score = Σ weight[i][j] * piece_value
piece_value = +1 player / -1 opponent

<u>Πλεονεκτήματα:</u>
-Προτιμά γωνίες
-Ισχυρή για mid-game

<u>Μειονεκτήματα:</u>
-Αγνοεί κινητικότητα και σταθερότητα


3️⃣ **Heuristic C** — Mobility

Υπεύθυνος: Mike

Μετράει πόσες διαθέσιμες κινήσεις έχει ο παίκτης σε σχέση με τον αντίπαλο.

score = available_moves(player) – available_moves(opponent)

<u>Πλεονεκτήματα:</u>
-Πολύ καλή στο mid-game

<u>Μειονεκτήματα:</u>
-Όχι ιδανική στο endgame


4️⃣ **Heuristic D** — Stability

Υπεύθυνος: Mike

Μετράει τα "stable" κομμάτια που δεν μπορούν να ανατραπούν.

score = stable_own – stable_opponent

<u>Πλεονεκτήματα:</u>
-Εξαιρετική στο endgame
-Από τις καλύτερες ευρετικές

<u>Μειονεκτήματα:</u>
-Πολύ δύσκολη υλοποίηση


5️⃣ **Heuristic E** — Frontier Disks

Υπεύθυνος: Chris

Μετράει πόσα κομμάτια βρίσκονται δίπλα σε άδεια τετράγωνα (επικίνδυνες θέσεις).

score = opponent_frontier – own_frontier


<u>Πλεονεκτήματα:</u>
-Αναγνωρίζει ευάλωτες περιοχές

<u>Μειονεκτήματα:</u>
-Όχι πλήρης από μόνη της


🔗 **Προτεινόμενα GitHub Projects για μελέτη**

Τα παρακάτω repos περιέχουν καλές υλοποιήσεις AI για Othello/ Reversi και μπορείτε να τα χρησιμοποιήσετε ως έμπνευση:

Για παράδειγμα μπορούμε να φτιάξουμε μερικές extra ευρέτικές με διαφορετικά weights στους πίνακες αντί για το (3,2,1).

✔ vedant-im10
[Παράδειγμα Weighted Heuristic σε Python](https://github.com/vedant-im10/AI-Game-Agent-for-Reversi/blob/main/Game%20Agent%20for%20Reversi.py)

✔ GalaX1us/Othello-Agents
[Python agents με hybrid evaluation](https://github.com/GalaX1us/Othello-Agents/blob/main/heuristics.py)

✔ eigenfoo/otto-othello
Πολύ καλός πίνακας βαρών και advanced heuristics σε cpp(https://github.com/eigenfoo/otto-othello/blob/master/src/heuristic.cpp)

Ψάξτε και άλλους αν θέλετε ώστε να κάνουμε τηνν ευρετική ακόμα καλύτερη


🧠 **Κοινοί Κανόνες Υλοποίησης**

Ο στόχος είναι να φτιάξουμε αυτές τις 5 ευρετικές έξω από την μέθοδο evaluate():

```def evaluate_piece_diff(self, player):
    ...

def evaluate_weighted(self, player):
    ...

def evaluate_mobility(self, player):
    ...

def evaluate_stability(self, player):
    ...

def evaluate_frontier(self, player):
    ...
```

Όλες οι ευρετικές θα χρησιμοποιήθουν μέσα στην evaluate():

```class Board:

    def evaluate(self, player, level=1):
        if level == 1:
            return self.heuristic_simple(player)
        elif level == 2:
            return self.heuristic_weighted(player)
        elif level == 3:
            return self.heuristic_mobility(player)
        elif level == 4:
            return self.heuristic_corners(player)
        elif level == 5:
            return self.heuristic_stability(player)
        elif level == 6:
            3 * self.evaluate_weighted(player) +
            4 * self.evaluate_mobility(player) +
            5 * self.evaluate_stability(player)
        else:
            raise ValueError("Unknown heuristic level")
```

Θα κάνουμε και διάφορους συνδυασμούς για να δούμε ποιος 
συνδιασμός αποδίδει καλύτερα ώστε να καθορίσουμε τα levels.

Η σύγκριση θα γίνει με Minimax (βάθος 3–5).

Ο κώδικας πρέπει να τρέχει πάνω στην υπάρχουσα κλάση Board.

📊 **Τελικές Παραδόσεις**

<u>Κάθε μέλος θα παραδώσει:</u>

Τον κώδικα της ευρετικής του.
Στο τέλος γίνεται σύγκριση και ψηφίζουμε ποια ευρετική αποδίδει καλύτερα.
Θα κρατήσουμε ενδεικτικά 5-10 levels.