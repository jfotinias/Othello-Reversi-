from Board import Board

def main():
    game = Board()
    print("Αρχική κατάσταση πίνακα:")
    game.print_board()

    # Ο τελευταίος παίκτης ήταν W, άρα ξεκινά ο B
    while not game.is_terminal():
        # Εναλλαγή παίκτη
        current_player = game.B if game.last_player == game.W else game.W
        symbol = "B" if current_player == game.B else "W"

        # Εύρεση διαθέσιμων κινήσεων
        moves = game.available_moves()

        # Αν δεν υπάρχουν κινήσεις, παραλείπει τη σειρά του
        if not moves:
            print(f"⚠️  Ο {symbol} δεν έχει διαθέσιμες κινήσεις! Παράλειψη σειράς.")
            game.change_last_player()
            continue

        # Επιλέγει την πρώτη διαθέσιμη κίνηση (ή θα μπορούσε να είναι AI)
        row, col = moves[0]
        print(f"\nΟ {symbol} παίζει στο ({row}, {col})")

        # Εκτέλεση κίνησης
        game.make_move(row, col, current_player)
        game.print_board()

    # Τέλος παιχνιδιού
    print("\n🎯 Το παιχνίδι τελείωσε!")
    white_count = sum(row.count(game.W) for row in game.Board)
    black_count = sum(row.count(game.B) for row in game.Board)

    print(f"Λευκά (W): {white_count}")
    print(f"Μαύρα (B): {black_count}")

    if white_count > black_count:
        print("🏁 Νίκη για τον Λευκό!")
    elif black_count > white_count:
        print("🏁 Νίκη για τον Μαύρο!")
    else:
        print("🤝 Ισοπαλία!")


main()