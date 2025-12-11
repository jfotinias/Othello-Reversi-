import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dino',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dino.html',
  styleUrl: './dino.css' 
})
export class DinoComponent implements OnInit {
  
  @Input() currentMessage: string = ''; 

  // Θα μπορούσες να χρησιμοποιήσεις εδώ μια στατική εικόνα δεινοσαύρου
  dinoImageUrl: string = 'assets/dino.png'; 

  constructor() { }

  ngOnInit(): void {
    // Φόρτωσε εδώ την εικόνα του δεινοσαύρου
  }
}