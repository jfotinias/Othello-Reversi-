import { Component, OnInit, ViewChild } from '@angular/core';
import { Board } from './components/board/board';
import { SetupComponent } from './components/setup/setup';
import { GameService } from './services/game.service';
import { CommonModule } from '@angular/common';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Board, SetupComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit { // Αυτό είναι τώρα σωστό
  
  @ViewChild(Board) boardComponent!: Board;

  gameStarted: boolean = false; 
  message: string = 'Διάλεξε ρυθμίσεις και πάτα Έναρξη.';

  constructor(private gameService: GameService) {}

requestAiTurn(): void {
    // Εμφανίζουμε μήνυμα σκέψης πριν την καθυστέρηση
    this.message = "Ο AI σκέφτεται...";
    
    this.gameService.aiTurn().pipe(delay(1000)).subscribe({
        next: (aiResponse: any) => {
            
            // 1. Ενημέρωση πίνακα με την τελευταία κίνηση (πρέπει να γίνει πριν τον έλεγχο τερματισμού)
            this.handleBoardMessage(aiResponse.message); 
            
            // 2. Φορτώνουμε τον πίνακα (για να φαίνεται η κίνηση του AI)
            if (this.boardComponent) {
                this.boardComponent.loadBoard(); 
            }

            // 3. ΕΛΕΓΧΟΣ ΤΕΡΜΑΤΙΣΜΟΥ
            if (aiResponse.message.includes("Το παιχνίδι τελείωσε.")) {
                this.handleGameEnd({
                    message: aiResponse.message, 
                    scores: aiResponse.scores || null
                });
                return; // Σταματάμε την αλυσίδα
            }

            // 4. Αναδρομή (αν χρειάζεται)
            if (aiResponse.next_player_is_ai) {
                 this.requestAiTurn(); 
            }
        },
        error: (err) => {
             // 5. Χειρισμός Σφάλματος
             this.handleBoardMessage("⚠️ Σφάλμα στην κίνηση AI: " + (err.error?.detail || err.message));
        }
    });
}
// Νέα Μέθοδος που καλείται από το SetupComponent
  handleSetup(data: { color: 'W' | 'B', depth: number }): void {
        
    // Κλήση στο FastAPI endpoint /setup_game/
    this.gameService.setupGame(data.color, data.depth).subscribe({
      next: (response: any) => {
        this.message = response.message;
        this.gameStarted = true; // 🔑 Εμφανίζεται ο πίνακας

        if (data.color === 'W') { 
          setTimeout(() => {this.requestAiTurn();}, 0);          
        }
      },
      error: (err) => {
        this.message = 'Σφάλμα κατά την έναρξη: ' + (err.error?.detail || 'Δεν τρέχει το backend.');
        this.gameStarted = false;
      }
    });
  }

  // Η ΥΠΟΧΡΕΩΤΙΚΗ ΜΕΘΟΔΟΣ για το OnInit Interface
  ngOnInit(): void {
    // Εδώ θα έμπαινε κώδικας που εκτελείται μία φορά μετά την αρχικοποίηση του component
  }

  finalScores: {W: number, B: number} | null = null;

  handleBoardMessage(msg: string, scores: {W: number, B: number} | null = null): void {
    this.message = msg;
    this.finalScores = scores;
  }

  handleGameEnd(event: { message: string, scores: any }): void {
    this.message = event.message;
    this.finalScores = event.scores; // Αυτό θα κάνει το div ορατό!
    
    // (Βεβαιωθείτε ότι το handleBoardMessage(msg) δεν μηδενίζει το finalScores)
  }

  
  resetGame(): void {  
    this.gameStarted = false;    // Κρύβουμε τον πίνακα app-board
    this.finalScores = null;     // Κρύβουμε το Scoreboard div
    this.message = 'Διάλεξε ρυθμίσεις και πάτα Έναρξη.';

    // 2. ΚΑΛΟΥΜΕ το reset endpoint
    this.gameService.reset().subscribe({
        next: () => {
            // 3. Ανανέωση του BoardComponent (τώρα που είναι κρυμμένο)
            if (this.boardComponent) {
                this.boardComponent.loadBoard(); 
            }
        },
        error: (err) => {
            this.message = "Αποτυχία reset: " + err.message;
        }
    });
  }
}
