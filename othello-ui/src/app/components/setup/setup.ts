import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './setup.html',
  styleUrls: ['./setup.css']
})
export class SetupComponent {
  
  // 1. Δεδομένα που θα επιλέξει ο χρήστης
  selectedColor: 'W' | 'B' = 'B'; // Default: Μαύρος
  selectedDepth: number = 3;      // Default: 3
  
  // Δυνατές επιλογές βάθους για τη μπάρα (slider)
  depthOptions: number[] = [1, 2, 3, 4, 5, 6]; 

  // 2. Output Event για να στείλουμε τις επιλογές στο γονικό component
  @Output() setupCompleted = new EventEmitter<{ color: 'W' | 'B', depth: number }>();

  // 3. Μέθοδος που καλείται από το κουμπί 'Start Game'
  startGame(): void {
    // Εκπέμπουμε τα επιλεγμένα δεδομένα
    this.setupCompleted.emit({
      color: this.selectedColor,
      depth: this.selectedDepth
    });
  }
}