import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { switchMap } from 'rxjs/operators';
import { timer, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class Board implements OnInit {

  @Input() isGameOver: boolean = false;
  @Output() messageEvent = new EventEmitter<string>();

  board: number[][] = [];
  boardFlat: number[] = [];

  constructor(
  private gameService: GameService,
  private cdr: ChangeDetectorRef
) {}

  available_moves: [number, number][] = [];

  getRow(index: number): number {
  return Math.floor(index / 8);
  }

  getCol(index: number): number {
  return index % 8;
  }


  ngOnInit(): void {
    this.loadBoard();
  }

loadBoard(): Promise<void> { // Τώρα επιστρέφει Promise
  console.log("Before API call → boardFlat:", this.boardFlat);

  // Δημιουργούμε ένα νέο Promise που θα επιλυθεί (resolve) όταν ολοκληρωθεί το subscribe.
  return new Promise((resolve, reject) => {
    this.gameService.getState().subscribe({
      next: (state: any) => {
        
        // 1. Ενημέρωση state (όπως πριν)
        this.board = state.board;
        this.boardFlat = this.board.flat();
        this.available_moves = state.available_moves || [];

        this.cdr.detectChanges();  
        resolve(); // Επιλύουμε το Promise: Η φόρτωση ολοκληρώθηκε!
      },
      error: err => {
        console.error("API ERROR:", err);
        reject(err); // Απορρίπτουμε το Promise αν υπάρχει σφάλμα
      }
    });
  });
}

//  Ελέγχει αν οι συντεταγμένες αντιστοιχούν σε έγκυρη κίνηση
  isMoveAvailable(row: number, col: number): boolean {
    if (!this.available_moves) return false;
    // Ελέγχουμε αν υπάρχει έγκυρη κίνηση για αυτές τις συντεταγμένες
    return this.available_moves.some(move => move[0] === row && move[1] === col);
  }

async handleAiChain(): Promise<void> { // Η συνάρτηση γίνεται async
    
    this.messageEvent.emit("Ο AI σκέφτεται..."); 

    // 1. Εφαρμόζουμε την καθυστέρηση
    const delayObservable = timer(1000); 

    try {
        const aiResponse = await lastValueFrom(delayObservable.pipe(
            // Μόλις τελειώσει η καθυστέρηση, εκτελούμε την κλήση API
            switchMap(() => this.gameService.aiTurn()) 
        ));

        // 2. Ενημέρωση UI με την κίνηση του AI
        this.messageEvent.emit(aiResponse.message);
        await this.loadBoard(); // ❗ ΠΕΡΙΜΕΝΟΥΜΕ: Περιμένουμε την ανανέωση

        // 3. Αναδρομή (εάν ο AI πρέπει να παίξει ξανά)
        if (aiResponse.next_player_is_ai && aiResponse.message !== "Το παιχνίδι τελείωσε.") {
            await this.handleAiChain(); // ❗ Αναδρομική κλήση με await
        }
    } catch (aiErr: any) {
        this.messageEvent.emit("Σφάλμα στην κίνηση AI: " + (aiErr.error?.detail || ""));
    }
}

@Output() gameEndEvent = new EventEmitter<{ message: string, scores: any }>(); // ❗ ΝΕΟ EVENT

async handleGameEnd(): Promise<void> {
    try {
        const finalState = await lastValueFrom(this.gameService.getState());

        if (finalState.scores) {
            this.gameEndEvent.emit({
                message: finalState.message,
                scores: finalState.scores 
            });
        }
    } catch (error) {
        console.error("Failed to fetch final state:", error);
    }
}

async onCellClick(i: number, j: number) {
    
    if (this.isGameOver) {
      // Μπορείς να εκπέμψεις ένα μήνυμα αν θέλεις
      this.messageEvent.emit("Το παιχνίδι έχει τελειώσει. Πατήστε Reset.");
      return; 
    }
    try {
        const humanResponse = await lastValueFrom(this.gameService.makeMove(i, j));

        // 1. Ενημέρωση UI με την κίνηση του ανθρώπου
        this.messageEvent.emit(humanResponse.message);
        await this.loadBoard(); 

        // 2. Εάν το παιχνίδι τελείωσε ΑΜΕΣΩΣ με την κίνηση του ανθρώπου
        if (humanResponse.message.includes("Τέλος παιχνιδιού")) {
             this.handleGameEnd(); 
             return; 
        }
        
        // 3. Αν η σειρά περνάει στον AI, ξεκινάμε την αλυσίδα
        if (humanResponse.next_player_is_ai) {
             await this.handleAiChain();
        }

        // 4. ΕΛΕΓΧΟΣ: Μήπως το handleAiChain ΤΕΛΕΙΩΣΕ το παιχνίδι;
        // Το handleAiChain πρέπει να εκπέμπει event gameEndEvent αν τελειώσει το παιχνίδι.
        // Εάν δεν υπάρχει event, πρέπει να γίνει έλεγχος.
        
        // 💡 Εάν η handleAiChain ολοκληρώθηκε, ζητάμε την τελική κατάσταση.
        const finalState = await lastValueFrom(this.gameService.getState());
        
        if (finalState.message && finalState.message.includes("Τέλος παιχνιδιού")) {
            this.handleGameEnd();
        }

    } catch (err: any) { 
        this.messageEvent.emit("⚠️ Άκυρη κίνηση: " + (err.error?.detail || err.message));
    }
  }
}
