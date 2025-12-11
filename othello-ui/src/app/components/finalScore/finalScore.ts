import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-final-score',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finalScore.html',
  styleUrl: './finalScore.css'
})
export class FinalScoreComponent {
  
  // Λαμβάνει τα σκορ από το AppComponent
  @Input() scores: {W: number, B: number} | null = null; 
  
  // Εκπέμπει event για το reset
  @Output() resetGame = new EventEmitter<void>();

  onResetClick(): void {
    this.resetGame.emit();
  }
}