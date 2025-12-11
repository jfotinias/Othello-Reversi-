import { Component, OnInit, ViewChild } from '@angular/core';
import { Board } from './components/board/board';
import { SetupComponent } from './components/setup/setup';
import { FinalScoreComponent } from './components/finalScore/finalScore';
import { DinoComponent } from './components/dino/dino';
import { GameService } from './services/game.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { delay } from 'rxjs/operators';

// 1. ΟΡΙΣΜΟΣ ΤΩΝ ΦΑΣΕΩΝ (GamePhase)
export enum GamePhase {
  Start = 'Start', // Εμφανίζεται το SetupComponent
  Play = 'Play',   // Εμφανίζεται το BoardComponent
  End = 'End'      // Εμφανίζεται το FinalScoreComponent
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Board, SetupComponent, FinalScoreComponent, DinoComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit { // Αυτό είναι τώρα σωστό
  
  @ViewChild(Board) boardComponent!: Board;

  public GamePhase = GamePhase;

  gamePhase: GamePhase = GamePhase.Start;
  message: string = 'Γεια σου θνητέ! Ας παίξουμε μία παρτίδα. Σε αφήνω να διαλέξεις τις ρυθμίσεις!';
  finalScore: {W: number, B: number} | null = null;

  constructor(private gameService: GameService, private cdRef: ChangeDetectorRef) {}

  // Η ΥΠΟΧΡΕΩΤΙΚΗ ΜΕΘΟΔΟΣ για το OnInit Interface
  ngOnInit(): void {
  // Εδώ θα έμπαινε κώδικας που εκτελείται μία φορά μετά την αρχικοποίηση του component
  }

  // Νέα Μέθοδος που καλείται από το SetupComponent
  handleSetup(data: { color: 'W' | 'B', depth: number }): void {
        
    // Κλήση στο FastAPI endpoint /setup_game/
    this.gameService.setupGame(data.color, data.depth).subscribe({
      next: (response: any) => {
        
        if (data.color === 'W') {
          this.message = `Επέλεξες το Λευκό. Ξεκινάω!`;
          delay(1000);
        } else {
          this.message = `Επέλεξες το Μαύρο. Κάνε την πρώτη σου κίνηση.`;
        }

        this.gamePhase = GamePhase.Play;

        this.cdRef.detectChanges();

        if (this.boardComponent) {
          this.boardComponent.loadBoard(); 
        } else {
          console.warn("BoardComponent still undefined after detectChanges. Using fallback.");
        }

        if (data.color === 'W') { 
          setTimeout(() => {this.requestAiTurn();}, 2000);          
        }
      },
      error: (err) => {
        this.message = 'Σφάλμα κατά την έναρξη: ' + (err.error?.detail || 'Δεν τρέχει το backend.');
        this.gamePhase = GamePhase.Play;
      }
    });
  }

  handleGameEnd(event: { message: string, scores: any }): void {
    this.message = event.message;
    this.finalScore = event.scores;
    this.gamePhase = GamePhase.End; // Αυτό θα κάνει το div ορατό!
    
    // (Βεβαιωθείτε ότι το handleBoardMessage(msg) δεν μηδενίζει το finalScores)
  }
requestAiTurn(): void {
    this.gameService.aiTurn().pipe(delay(1000)).subscribe({
        next: (aiResponse: any) => {
            
            // 1. Ενημέρωση πίνακα με την τελευταία κίνηση (πρέπει να γίνει πριν τον έλεγχο τερματισμού)
            this.handleBoardMessage(aiResponse.message); 
            if (aiResponse) {
                this.message = aiResponse.message
            } else {
                this.message = 'Έπαιξα!'
            }
            // 2. Φορτώνουμε τον πίνακα (για να φαίνεται η κίνηση του AI)
            if (this.boardComponent) {
                this.boardComponent.loadBoard(); 
            }

            // 3. ΕΛΕΓΧΟΣ ΤΕΡΜΑΤΙΣΜΟΥ
            if (aiResponse.scores) {
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

  handleBoardMessage(msg: string, scores: {W: number, B: number} | null = null): void {
    this.message = msg;
    this.finalScore = scores;
  }

  
  resetGame(): void {  
    this.gamePhase = GamePhase.Start;  
    this.finalScore = null;     // Κρύβουμε το Scoreboard div
    this.message = 'Ας παίξουμε ξανά';

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
