from Board import Board
from Player import HumanPlayer, AIPlayer

def main():
    game = Board()

    # Human = Black (-1), AI = White (1)
    human = HumanPlayer(game.B)
    ai = AIPlayer(game.W)

    current_player = human if game.last_player == game.W else ai

    while True:
        print("\n-----------------------------------")
        print(f"🔄 Σειρά του {'B' if current_player.player_letter == game.B else 'W'}")

        # Τερματισμός παιχνιδιού
        if game.is_terminal():
            break

        game.print_board()

        available = game.available_moves()

        if not available:
            print("⚠️ Αυτός ο παίκτης δεν έχει διαθέσιμες κινήσεις. Πάσο.")
            game.change_last_player()
            current_player = ai if current_player is human else human
            continue

        # Παίζει κίνηση
        move = current_player.choose_move(game)
        row, col = move

        print(f"▶ Κίνηση στο ({row}, {col})")
        game.make_move(row, col, current_player.player_letter)

        # Αλλαγή παίκτη
        current_player = ai if current_player is human else human

    # --- ΤΕΛΙΚΑ ΑΠΟΤΕΛΕΣΜΑΤΑ ---
    print("\n🏁 Τελική κατάσταση:")
    game.print_board()

    whites = sum(r.count(game.W) for r in game.Board)
    blacks = sum(r.count(game.B) for r in game.Board)

    print(f"Λευκά (W): {whites}")
    print(f"Μαύρα (B): {blacks}")

    if whites > blacks:
        print("🎉 Νίκη για τα λευκά!")
    elif blacks > whites:
        print("🎉 Νίκη για τα μαύρα!")
    else:
        print("🤝 Ισοπαλία!")


main()