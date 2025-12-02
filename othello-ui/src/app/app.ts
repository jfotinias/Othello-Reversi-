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
    this.message = "Ο AI σκέφτεται...";
    
    this.gameService.aiTurn().pipe(delay(1000)).subscribe({
        next: (aiResponse: any) => {
            
            // 1. ΕΚΠΕΜΨΗ ΤΟΥ ΜΗΝΥΜΑΤΟΣ ΕΠΙΤΥΧΙΑΣ ΤΟΥ AI
            this.handleBoardMessage(aiResponse.message); 
            
            // 2. ❗ ΑΝΑΝΕΩΣΗ ΠΙΝΑΚΑ (Απαραίτητο βήμα)
            if (this.boardComponent) {
                this.boardComponent.loadBoard(); 
            }
            
            // 3. Αναδρομή
            if (aiResponse.next_player_is_ai) {
                 this.requestAiTurn(); 
            }
        },
        error: (err) => {
             // 4. ΧΕΙΡΙΣΜΟΣ ΠΡΑΓΜΑΤΙΚΩΝ ΣΦΑΛΜΑΤΩΝ API
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
    // 1. Καλούμε το reset endpoint
    this.gameService.reset().subscribe({
        next: () => {
            // 2. Επαναφέρουμε την κατάσταση του UI/παιχνιδιού
            this.gameStarted = false;
            this.finalScores = null;
            this.message = 'Διάλεξε ρυθμίσεις και πάτα Έναρξη.';
            
            // 3. (Προαιρετικό) Καλεί το loadBoard του BoardComponent για να καθαρίσει τον πίνακα
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
