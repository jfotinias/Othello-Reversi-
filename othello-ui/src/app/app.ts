import { Component, OnInit } from '@angular/core';
import { Board } from './components/board/board';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Board],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit { // Αυτό είναι τώρα σωστό
  message: string = 'Διάλεξε χρώμα και βάθος για να ξεκινήσεις!';

  // Η ΥΠΟΧΡΕΩΤΙΚΗ ΜΕΘΟΔΟΣ για το OnInit Interface
  ngOnInit(): void {
    // Εδώ θα έμπαινε κώδικας που εκτελείται μία φορά μετά την αρχικοποίηση του component
  }

  handleBoardMessage(msg: string): void {
    this.message = msg;
  }
}
