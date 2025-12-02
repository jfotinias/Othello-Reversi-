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

  // Ορισμός των ορίων του slider
  minDepth: number = 1;
  maxDepth: number = 6;
  
  // Χρώματα για τη διαβάθμιση του slider
  selectedColorTrack: string = '#a2ff00'; // Πράσινο για το επιλεγμένο μέρος
  unselectedColorTrack: string = '#ccc';  // Γκρι για το μη επιλεγμένο μέρος

  // 2. Output Event (διατηρείται)
  @Output() setupCompleted = new EventEmitter<{ color: 'W' | 'B', depth: number }>();

  // 3. Getter για τον υπολογισμό του δυναμικού background
  get trackStyle(): string {
    // Υπολογισμός του ποσοστού με βάση την τρέχουσα τιμή (selectedDepth)
    const range = this.maxDepth - this.minDepth; // 6 - 1 = 5 (το συνολικό εύρος)
    const value = this.selectedDepth - this.minDepth; // Π.χ. 3 - 1 = 2 (η τρέχουσα τιμή εντός του εύρους)
    const percentage = (value / range) * 100;

    // Δημιουργία του linear-gradient
    return `linear-gradient(to right, 
              ${this.selectedColorTrack} 0%, 
              ${this.selectedColorTrack} ${percentage}%, 
              ${this.unselectedColorTrack} ${percentage}%, 
              ${this.unselectedColorTrack} 100%)`;
  }

  // 4. Μέθοδος που καλείται από το κουμπί 'Start Game'
  startGame(): void {
    // Εκπέμπουμε τα επιλεγμένα δεδομένα
    this.setupCompleted.emit({
      color: this.selectedColor,
      depth: this.selectedDepth
    });
  }
}