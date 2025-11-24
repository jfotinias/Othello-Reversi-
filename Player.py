from abc import ABC, abstractmethod
from Move import Move
from Board import Board

class Player(ABC):
    def __init__(self, player_letter):
        self.player_letter = player_letter
    
    @abstractmethod
    def print_player(self):
        pass
    
    @abstractmethod
    def equals(self, other_player):
        pass

    @abstractmethod
    def choose_move(self, board):
        pass


class HumanPlayer(Player):
    def print_player(self):
        return "W" if self.player_letter == 1 else "B"
    
    def equals(self, other_player):
        return self.player_letter == other_player.player_letter

    def choose_move(self, board):
        moves = board.available_moves()

        if not moves:
            print("Δεν υπάρχουν διαθέσιμες κινήσεις.")
            return None

        print("Διαθέσιμες κινήσεις:")
        for i, move in enumerate(moves):
            print(f"{i}: {move}")

        while True:
            try:
                index = int(input("Δώσε το index της κίνησης: "))
        
                if index < 0 or index >= len(moves):
                    print("Άκυρο index! Δώσε έναν αριθμό από τη λίστα.")
                    continue

                return moves[index]
            
            except ValueError:
                print("Πρέπει να δώσεις αριθμό. Προσπάθησε ξανά.")


class AIPlayer(Player):
    def __init__(self, player_letter, max_depth=3):
        super().__init__(player_letter)
        self.max_depth = max_depth

    def print_player(self):
        return "W" if self.player_letter == 1 else "B"
    
    def equals(self, other_player):
        return self.player_letter == other_player.player_letter

    def choose_move(self, board):
        best_move = self.minimax(board)

        if best_move is None:
            return None
    
        return (best_move.row, best_move.col)
    

    def minimax(self, board):
        # AI είναι max-player
        if self.player_letter == board.W:
            return self.max(board, 0)
        else:
            return self.min(board, 0)


    def min(self, board, depth):

        if depth == self.max_depth or board.is_terminal():
            return Move(board.last_move.row, board.last_move.col, board.evaluate_weighted(self.player_letter))
    
        children = board.get_children(-self.player_letter)
        min_move = Move(value=float('inf'))

        for (i, j), child in children.items():
            current_move = self.max(child, depth + 1)
            current_move.row = i
            current_move.col = j

            if current_move.value < min_move.value:
                min_move = current_move

        return min_move


    def max(self, board, depth):

        if depth == self.max_depth or board.is_terminal():
            return Move(board.last_move.row, board.last_move.col, board.evaluate_weighted(self.player_letter))
    
        children = board.get_children(self.player_letter)
        max_move = Move(value=float('-inf'))

        for (i, j), child in children.items():
            current_move = self.min(child, depth + 1)
            current_move.row = i
            current_move.col = j

            if current_move.value > max_move.value:
                max_move = current_move

        return max_move

    