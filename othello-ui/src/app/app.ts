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
            
          this.handleBoardMessage(aiResponse.message);

          if (this.boardComponent) { // Έλεγχος για ασφάλεια
                  this.boardComponent.loadBoard(); 
              }
              //  ΚΡΙΣΙΜΟΣ ΕΛΕΓΧΟΣ: Εάν ο AI πρέπει να παίξει ξανά
          if (aiResponse.next_player_is_ai) {
                  //  Αναδρομική κλήση: Ο AI παίζει αμέσως ξανά
              this.requestAiTurn(); 
            }
              // Αν το παιχνίδι τελείωσε, η αλυσίδα σταματά
          },
          error: (err) => {
             this.handleBoardMessage("Σφάλμα στην κίνηση AI: " + (err.error?.detail || err.message));
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

  handleBoardMessage(msg: string): void {
    this.message = msg;
  }
}
