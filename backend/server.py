from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from Board import Board
from Player import HumanPlayer, AIPlayer
import messages

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

game = Board()
ai = None
human = None

# ------ Setup Request ------
class SetupRequest(BaseModel):
    human_color: str   # "W" or "B"
    depth: int


# ------ Setup Game Endpoint ------
@app.post("/api/setup_game/")
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
@app.get("/api/state")
def get_state():
    # Βασικά δεδομένα κατάστασης
    state = {
        "board": game.Board,
        "last_move": (
            game.last_move.row,
            game.last_move.col
        ) if game.last_move else None,
        "last_player": game.last_player,
        "available_moves": game.available_moves() if game.last_player == ai.player_letter else None
    }
    
    # Εάν το παιχνίδι τελείωσε, υπολογίζουμε τα σκορ και προσθέτουμε το message
    if game.is_terminal():
        scores = game.get_scores() # <-- ΚΑΛΟΥΜΕ ΤΟΝ ΥΠΟΛΟΓΙΣΜΟ ΣΚΟΡ
        
        # ΠΡΟΣΘΗΚΗ: Τα σκορ και το τελικό μήνυμα
        state["scores"] = scores
        state["message"] = "Καλό παιχνίδι!"
        
    return state


# ------ Make Move Endpoint ------
class MoveRequest(BaseModel):
    row: int
    col: int


@app.post("/api/make_move/")
def make_move(data: MoveRequest):
    global game, human

    # --- 1. ΕΛΕΓΧΟΣ ΑΝ ΤΟ ΠΑΙΧΝΙΔΙ ΕΧΕΙ ΤΕΛΕΙΩΣΕΙ ---
    if game.is_terminal():
        raise HTTPException(status_code=400, detail="Το παιχνίδι έχει ήδη τελειώσει.")
    
    # --- 2. ΕΛΕΓΧΟΣ ΣΕΙΡΑΣ (ΑΠΑΡΑΙΤΗΤΟ) ---
    player_to_move = game.B if game.last_player == game.W else game.W
    if player_to_move != human.player_letter:
        raise HTTPException(status_code=403, detail="Περίμενε, σκέφτομαι...")
    
    human_move = (data.row, data.col)
    message = ""

    # 3. --- Έλεγχος Εγκυρότητας Κίνησης ---
    if not game.is_valid_move(data.row, data.col):
        raise HTTPException(status_code=400, detail=messages.get_invalid_move_message())
    
    human_has_moves = game.available_moves_for(human.player_letter)
    if human_has_moves:
        game.make_move(data.row, data.col, human.player_letter)
        message = messages.get_comment_move_message()
    else:
        human_move = None # Ο άνθρωπος κάνει πάσο
        game.change_last_player()  # Αλλάζουμε σειρά στον AI

    if game.is_terminal():
        scores = game.get_scores()    
        message = "Καλό παιχνίδι"
        return {
            "message": message,
            "board": game.Board,
            "human_move": human_move,
            "scores": scores,
            "next_player_is_ai": False # <-- Το παιχνίδι τελείωσε, δεν έχει σειρά κανείς
        }
    else:
        return {
            "message": message,
            "board": game.Board,
            "human_move": human_move,
            "next_player_is_ai": True # <-- Η σειρά είναι του AI    
        }
        
# ------ AI Turn Endpoint ------

@app.post("/api/ai_turn/")
def ai_turn():
    global game, ai

    # 1. ΕΛΕΓΧΟΣ ΣΕΙΡΑΣ: Ο AI πρέπει να έχει σειρά.
    player_to_move = game.B if game.last_player == game.W else game.W
    if player_to_move != ai.player_letter:
        raise HTTPException(status_code=403, detail="Δεν είναι η σειρά του AI να παίξει.")
        
    # --- 2. ΕΛΕΓΧΟΣ ΑΝ ΤΟ ΠΑΙΧΝΙΔΙ ΕΧΕΙ ΤΕΛΕΙΩΣΕΙ ---
    if game.is_terminal():
        # Αυτό δεν θα πρέπει να συμβεί αν λειτουργεί σωστα το make_move αλλά είναι ένα πρόσθετο μέτρο ασφαλείας.
        raise HTTPException(status_code=400, detail="Το παιχνίδι έχει ήδη τελειώσει.")
    

    ai_move = None
    message = ""

    ai_has_moves = game.available_moves_for(ai.player_letter)

    # 2. Κίνηση AI (Minimax)    
    if not ai_has_moves:
        # Ο AI κάνει πάσο
        message = messages.get_pass_message()
        game.change_last_player()  # Αλλάζουμε σειρά στον άνθρωπο
        
    else:
        # Ο AI παίζει κανονικά
        ai_move = ai.choose_move(game)
        
        if ai_move is not None:
            r, c = ai_move
            game.make_move(r, c, ai.player_letter)
            message = messages.get_ai_play_message()
        else:
            # Σπάνια περίπτωση, αλλά αν συμβεί, θεωρούμε πάσο και αλλάζουμε σειρά.
            ai_move = None
            message = messages.get_pass_message()
            game.change_last_player() # <-- ΠΡΟΣΘΗΚΗ

    # 3. Έλεγχος Τέλος Παιχνιδιού
    if game.is_terminal():
        scores = game.get_scores()
        message = "Καλό παιχνίδι"
        return {
            "message": message, 
            "ai_move": ai_move,
            "board": game.Board,
            "scores": scores,
            "next_player_is_ai": False # <-- Το παιχνίδι τελείωσε, δεν έχει σειρά κανείς
        }
    else:
        human_has_moves = game.available_moves_for(human.player_letter)
        if not human_has_moves:
            game.change_last_player()          
            return {
            "message": message, 
            "ai_move": ai_move,
            "board": game.Board,
            "next_player_is_ai": True
            }
        else:        
            return {
            "message": message, 
            "ai_move": ai_move,
            "board": game.Board,
            "next_player_is_ai": False # <-- Η σειρά είναι του ανθρώπου    
        }

# ------ Reset Endpoint ------
@app.post("/api/reset")
def reset():
    global game, ai, human
    game = Board()
    return {"status": "reset"}
