import copy
from Move import Move

class Board:
    W = 1
    B = -1
    EMPTY = 0


    def __init__(self):
        self.last_move = Move()
        self.last_player = self.W
        self.Board = [[self.EMPTY for _ in range(8)] for _ in range(8)]
        # αρχική θέση Othello
        self.Board[3][3] = self.W
        self.Board[4][4] = self.W
        self.Board[3][4] = self.B
        self.Board[4][3] = self.B


    def __copy__(self):
        new_board = Board()
        new_board.last_move = copy.copy(self.last_move)
        new_board.last_player = self.last_player
        new_board.Board = [row[:] for row in self.Board]
        return new_board


    def print_board(self):
        symbols = {self.W: 'W', self.B: 'B', self.EMPTY: '.'}
        print("    0 1 2 3 4 5 6 7")
        print("  __________________")
        for i, row in enumerate(self.Board):
            print(i, "|", " ".join(symbols[cell] for cell in row))
        print()
    
    def change_last_player(self):
        self.last_player = self.B if self.last_player == self.W else self.W

    def copy_change_last_player(self):
            new_board = copy.copy(self)
            new_board.last_player = self.B if self.last_player == self.W else self.W
            return new_board

    # βοηθητική συνάρτηση, επιστρέφει λίστες με τις 8 κατευθύνσεις (οριζόντια, κάθετα, διαγώνια)
    def get_lines(self, i, j):
        directions = [(-1, -1), (-1, 0), (-1, 1),
                      (0, -1),           (0, 1),
                      (1, -1),  (1, 0),  (1, 1)]               
        lines = []
        
        for di, dj in directions:
            path = []
            ni, nj = i + di, j + dj
            while 0 <= ni < len(self.Board) and 0 <= nj < len(self.Board[0]):
                path.append((ni, nj))
                ni += di
                nj += dj
            if path:
                lines.append(path)
        return lines
        

    def available_moves(self):
        # ο παίκτης που έχει σειρά
        current_player = self.B if self.last_player == self.W else self.W
        # ο τελευταίος που έπαιξε
        opponent = self.last_player

        def get_valid_moves():
            valid_moves = []
            for i in range(len(self.Board)):
                for j in range(len(self.Board[i])):
                    if self.Board[i][j] != self.EMPTY:
                        continue

                    for path in self.get_lines(i, j):
                        if len(path) < 2:
                            continue

                        first = self.Board[path[0][0]][path[0][1]]
                        if first != opponent:
                            continue

                        for (x, y) in path[1:]:
                            if self.Board[x][y] == self.EMPTY:
                                break
                            if self.Board[x][y] == current_player:
                                valid_moves.append((i, j))
                                break
            return valid_moves

        return list(set(get_valid_moves()))

    
    def make_move(self, row, col, letter):
        self.Board[row][col] = letter
        self.last_move = Move(row, col)

        current_player = letter
        opponent = self.last_player

        for path in self.get_lines(row, col):
            if len(path) < 2:
                continue
            
            first = self.Board[path[0][0]][path[0][1]]
            if first != opponent:
                continue

            for index, (x, y) in enumerate(path[1:], start = 1):
                if self.Board[x][y] == self.EMPTY:
                    break
                if self.Board[x][y] == current_player:
                    for (x, y) in path[:index]:
                        self.Board[x][y] = current_player
                    break

        self.last_player = letter

    
    def is_valid_move(self, row, col):
        if row > 7 or col > 7 or row < 0 or col < 0:
            return False  
        
        if self.Board[row][col] != self.EMPTY:
            return False
        
        if (row, col) not in self.available_moves():
            return False 
        
        return True
    
    
    def get_children(self, letter):
        children = []

        for (i, j) in self.available_moves():
            if self.is_valid_move(i, j):
                child = copy.deepcopy(self)
                child.make_move(i, j, letter)
                children.append(child)

        return children
    

    def is_terminal(self):
        if len(self.available_moves()) == 0 and len(self.copy_change_last_player().available_moves()) == 0:
            return True
        return False



# -------- MAIN --------
def main():
    game = Board()
    print("Αρχική κατάσταση πίνακα:")
    game.print_board()

    # Ο μαύρος ξεκινά (ο τελευταίος παίκτης είναι W)
    for turn in range(5):
        # Υπολογίζουμε ποιος έχει σειρά
        current_player = game.B if game.last_player == game.W else game.W
        symbol = "B" if current_player == game.B else "W"

        # Υπολογίζουμε τις διαθέσιμες κινήσεις
        moves = game.available_moves()

        # Αν δεν υπάρχουν, τελειώνει το παιχνίδι
        if not moves:
            print(f"⚠️  Ο {symbol} δεν έχει διαθέσιμες κινήσεις! Τέλος γύρου.")
            break

        # Επιλέγουμε την πρώτη διαθέσιμη κίνηση (ή κάποια συγκεκριμένη)
        move = moves[0]
        row, col = move

        # Παίζουμε την κίνηση
        print(f"\nΚίνηση {turn+1}: Παίζει ο {symbol} στο ({row}, {col})")
        game.make_move(row, col, current_player)
        game.print_board()

        # Τυπώνουμε τις διαθέσιμες κινήσεις του επόμενου παίκτη
        next_player = game.B if current_player == game.W else game.W
        next_symbol = "B" if next_player == game.B else "W"
        next_moves = game.available_moves()
        print(f"Διαθέσιμες κινήσεις για τον {next_symbol}: {next_moves}")

    print("\nΤελική κατάσταση πίνακα μετά από 5 κινήσεις:")
    game.print_board()


main()
