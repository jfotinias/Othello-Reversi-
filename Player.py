from abc import ABC, abstractmethod

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
        moves = board.available_moves()
        if not moves:
            return None
        return moves[0]
    
    def minimax(self, board, depth):
        if self.player_letter == board.B:
            return min(board, depth)
        else:
            return max(board, depth)

    def min(self, board, depth):
        pass

    def max(self, board, depth):
        pass