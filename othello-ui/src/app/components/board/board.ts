import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class Board implements OnInit {

  @Output() messageEvent = new EventEmitter<string>();

  board: number[][] = [];
  boardFlat: number[] = [];

  constructor(
  private gameService: GameService,
  private cdr: ChangeDetectorRef
) {}


  getRow(index: number): number {
  return Math.floor(index / 8);
  }

  getCol(index: number): number {
  return index % 8;
  }


  ngOnInit(): void {
    this.loadBoard();
  }

loadBoard() {
  console.log("Before API call → boardFlat:", this.boardFlat);

  this.gameService.getState().subscribe({
    next: (state: any) => {
      console.log("API returned:", state);

      this.board = state.board;
      this.boardFlat = this.board.flat();

      console.log("After flatten →", this.boardFlat);
      this.cdr.detectChanges();  
    },
    error: err => {
      console.error("API ERROR:", err);
    }
  });
}

handleAiChain(): void {
    // Εμφανίζουμε μήνυμα σκέψης πριν την καθυστέρηση
    this.messageEvent.emit("Ο AI σκέφτεται...");

    this.gameService.aiTurn().pipe(delay(2000)).subscribe({
        next: (aiResponse: any) => {
            this.messageEvent.emit(aiResponse.message);
            this.loadBoard();

            //  ΚΡΙΣΙΜΟΣ ΕΛΕΓΧΟΣ: Εάν ο AI πρέπει να παίξει ξανά
            if (aiResponse.next_player_is_ai && aiResponse.message !== "Το παιχνίδι τελείωσε.") {
                //  Αναδρομική κλήση: Ο AI παίζει αμέσως ξανά
                this.handleAiChain(); 
            }
            // Αν το παιχνίδι τελείωσε, η αλυσίδα σταματά
        },
        error: (aiErr) => {
            this.messageEvent.emit("Σφάλμα στην κίνηση AI: " + (aiErr.error?.detail || ""));
        }
    });
}

onCellClick(i: number, j: number) {
   this.gameService.makeMove(i, j).subscribe({
      next: (humanResponse: any) => {
 
      // 1. Ενημέρωση UI με την κίνηση του ανθρώπου
      this.messageEvent.emit(humanResponse.message);
      this.loadBoard();
      
      // Αν το παιχνίδι δεν τελείωσε και έχει σειρά ο AI:
      if (humanResponse.message !== "Το παιχνίδι τελείωσε." && humanResponse.next_player_is_ai) {  
        this.handleAiChain();
      }
    },
    error: (humanErr) => {
    this.messageEvent.emit("⚠️ Άκυρη κίνηση: " + humanErr.error?.detail);
    }
  });
}
}
