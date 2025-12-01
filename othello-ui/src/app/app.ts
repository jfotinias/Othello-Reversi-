import { Component, OnInit } from '@angular/core';
import { Board } from './components/board/board';
import { SetupComponent } from './components/setup/setup';
import { GameService } from './services/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Board, SetupComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit { // Αυτό είναι τώρα σωστό
  
  gameStarted: boolean = false; 
  message: string = 'Διάλεξε ρυθμίσεις και πάτα Έναρξη.';

  constructor(private gameService: GameService) {}
// Νέα Μέθοδος που καλείται από το SetupComponent
    handleSetup(data: { color: 'W' | 'B', depth: number }): void {
        this.message = 'Φόρτωση παιχνιδιού...';
        
        // Κλήση στο FastAPI endpoint /setup_game/
        this.gameService.setupGame(data.color, data.depth).subscribe({
            next: (response: any) => {
                this.message = response.message;
                this.gameStarted = true; // 🔑 Εμφανίζεται ο πίνακας
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
