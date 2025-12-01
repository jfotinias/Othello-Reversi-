from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from Board import Board
from Player import HumanPlayer, AIPlayer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

game = Board()
# Ορίζουμε τον άνθρωπο (human) ως Μαύρο (B) και τον AI ως Λευκό (W)
# B = -1, W = 1
HUMAN_COLOR = Board.B
AI_COLOR = Board.W
AI_DEPTH = 7 # Χρησιμοποιούμε σταθερό βάθος
human = HumanPlayer(HUMAN_COLOR)
ai = AIPlayer(AI_COLOR, AI_DEPTH)

# ------ Setup Request ------
class SetupRequest(BaseModel):
    human_color: str   # "W" or "B"
    depth: int


# ------ Setup Game Endpoint ------
@app.post("/setup_game/")
def setup_game(data: SetupRequest):
    global game, ai, human

    # reset board
    game = Board()

    # Convert W or B ↓ to your internal 1 / -1
    if data.human_color.upper() == "W":
        human = HumanPlayer(Board.W)
        ai = AIPlayer(Board.B, data.depth)
    else:
        human = HumanPlayer(Board.B)
        ai = AIPlayer(Board.W, data.depth)

    return {
        "message": "Το παιχνίδι ξεκίνησε!",
        "human_color": data.human_color,
        "ai_color": "B" if data.human_color.upper() == "W" else "W",
        "depth": data.depth}


# ------ State Endpoint ------
@app.get("/state")
def get_state():
    return {
        "board": game.Board,
        "last_move": (
            game.last_move.row,
            game.last_move.col
        ) if game.last_move else None,
        "last_player": game.last_player
    }


# ------ Make Move Endpoint ------
class MoveRequest(BaseModel):
    row: int
    col: int


@app.post("/make_move/")
def make_move(data: MoveRequest):
    global game, human

    # --- 1. ΕΛΕΓΧΟΣ ΣΕΙΡΑΣ (ΑΠΑΡΑΙΤΗΤΟ) ---
    player_to_move = game.B if game.last_player == game.W else game.W
    if player_to_move != human.player_letter:
        raise HTTPException(status_code=403, detail="Δεν είναι η σειρά σας να παίξετε. Περιμένετε τον AI.")

    # 2. Έλεγχος διαθέσιμων κινήσεων
    moves = game.available_moves_for(human.player_letter)
    if not moves:
        # Αυτό δεν πρέπει να συμβεί, καθώς το frontend πρέπει να το ελέγχει
        raise HTTPException(status_code=400, detail="Δεν έχετε διαθέσιμες κινήσεις (Πάσο).")

    # 3. Έλεγχος Εγκυρότητας Κίνησης (όπως πριν)
    if not game.is_valid_move(data.row, data.col):
        raise HTTPException(status_code=400, detail="Άκυρη κίνηση: Δεν είναι έγκυρη θέση.")
    
    # 4. Εκτέλεση Κίνησης
    game.make_move(data.row, data.col, human.player_letter)

    # 5. Έλεγχος Τέλος Παιχνιδιού
    if game.is_terminal():
        message = "Το παιχνίδι τελείωσε."
    else:
        # 6. Ο επόμενος παίκτης είναι ο AI.
        # Ελέγχουμε αν ο AI έχει κινήσεις. Αν όχι, η σειρά επιστρέφει στον άνθρωπο.
        ai_has_moves = game.available_moves_for(ai.player_letter)
        
        if not ai_has_moves:             
             # Η make_move έχει ήδη ενημερώσει το last_player = human.player_letter.
             # Αν ο AI κάνει πάσο, η σειρά παραμένει στον άνθρωπο, οπότε το last_player παραμένει σωστό.
             message = "Η κίνηση σας έγινε. Ο AI έκανε πάσο. Παίζετε ξανά!"
             
             # Ενημερώνουμε το frontend ότι η σειρά του AI τελείωσε.
             return {
                "message": message,
                "board": game.Board,
                "human_move": (data.row, data.col),
                "next_player_is_ai": False # <-- Ο AI ΔΕΝ παίζει, η σειρά είναι ξανά του ανθρώπου
            }

        # Αν ο AI έχει κινήσεις, η σειρά του AI ξεκινάει.
        message = "Η κίνηση σας έγινε. Περιμένουμε τον AI..."

    # 7. Επιστρέφουμε την κατάσταση μετά την κίνηση του ανθρώπου (ο AI έχει σειρά τώρα)
    return {
        "message": message,
        "board": game.Board,
        "human_move": (data.row, data.col),
        "next_player_is_ai": True # <-- Ο AI έχει σειρά
    }
# ------ AI Turn Endpoint ------

@app.post("/ai_turn/")
def ai_turn():
    global game, ai

    # 1. ΕΛΕΓΧΟΣ ΣΕΙΡΑΣ: Ο AI πρέπει να έχει σειρά.
    player_to_move = game.B if game.last_player == game.W else game.W
    if player_to_move != ai.player_letter:
        raise HTTPException(status_code=403, detail="Δεν είναι η σειρά του AI να παίξει.")
        
    # 2. Κίνηση AI (Minimax)    
    if not game.available_moves_for(ai.player_letter):
        # Ο AI κάνει πάσο
        ai_move = None
        message = "Ο AI έκανε πάσο."
        # Η σειρά πάει στον αντίπαλο (Άνθρωπο).
        game.change_last_player() # <-- ΠΡΟΣΘΗΚΗ: Ενημερώνουμε ότι ο άνθρωπος έπαιξε τελευταίος.
                                  # Αυτό κάνει τον last_player = human.player_letter.
    else:
        # Ο AI παίζει κανονικά
        ai_move = ai.choose_move(game)
        
        if ai_move is not None:
            r, c = ai_move
            game.make_move(r, c, ai.player_letter)
            message = "Ο AI έπαιξε."
        else:
            # Σπάνια περίπτωση, αλλά αν συμβεί, θεωρούμε πάσο και αλλάζουμε σειρά.
            ai_move = None
            message = "Ο AI έκανε πάσο (Minimax)."
            game.change_last_player() # <-- ΠΡΟΣΘΗΚΗ


    # 3. Τελικός Έλεγχος
    if game.is_terminal():
         message = "Το παιχνίδι τελείωσε."

    return {
        "message": message,
        "ai_move": ai_move,
        "board": game.Board,
        "next_player_is_ai": game.last_player != human.player_letter # <-- Ελέγχουμε ποιος έχει σειρά τώρα
    }

# ------ Reset Endpoint ------
@app.post("/reset")
def reset():
    global game, ai, human
    game = Board()
    return {"status": "reset"}
