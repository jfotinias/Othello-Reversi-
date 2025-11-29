from fastapi import FastAPI
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
ai = None
human = None

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
    global game, ai, human

    # --- Κίνηση ανθρώπου ---
    if not game.is_valid_move(data.row, data.col):
        return {"message": "Άκυρη κίνηση."}, 400
    
    game.make_move(data.row, data.col, human.player_letter)

    # --- Έλεγχος αν τελείωσε το παιχνίδι ---
    if game.is_terminal():
        return {
            "message": "Το παιχνίδι τελείωσε.",
            "board": game.Board
        }

    # --- Κίνηση AI ---
    ai_move = ai.choose_move(game)
    if ai_move is not None:
        r, c = ai_move
        game.make_move(r, c, ai.player_letter)

    return {
        "message": "Κίνηση αποδεκτή.",
        "human_move": (data.row, data.col),
        "ai_move": ai_move,
        "board": game.Board
    }



# ------ Reset Endpoint ------
@app.post("/reset")
def reset():
    global game, ai, human
    game = Board()
    return {"status": "reset"}
