from Board import Board
from Player import HumanPlayer, AIPlayer

def main():
    game = Board()

    human_letter = input("Διάλεξε χρώμα W ή B: ").upper()
    while human_letter not in ['W', 'B']:
        human_letter = input("Άκυρο χρώμα! Διάλεξε W ή B: ").upper()

    print(f"Εσύ παίζεις με τα {human_letter}.")
    ai_letter = 'W' if human_letter == 'B' else 'B'
    print(f"Ο υπολογιστής παίζει με τα {ai_letter}.")

    human = HumanPlayer(Board.W if human_letter == 'W' else Board.B)
    ai = AIPlayer(Board.W if ai_letter == 'W' else Board.B)

    # Ο B παίζει πάντα πρώτος στο Othello
    current_player = human if human_letter == 'B' else ai

    while True:
        print("\n-----------------------------------")
        print("🔄 Σειρά του", current_player.print_player())

        if game.is_terminal():
            break

        game.print_board()

        available = game.available_moves()
        if not available:
            print("⚠️ Δεν υπάρχουν διαθέσιμες κινήσεις. Πάσο.")
            game.change_last_player()
            current_player = ai if current_player is human else human
            continue

        move = current_player.choose_move(game)
        row, col = move

        print(f"▶ Κίνηση στο ({row}, {col})")
        game.make_move(row, col, current_player.player_letter)
        current_player = ai if current_player is human else human

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
