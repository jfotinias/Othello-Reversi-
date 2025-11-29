import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class Board implements OnInit {

  board: number[][] = [];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadBoard();
  }

  loadBoard() {
    this.gameService.getState().subscribe({
      next: (state: any) => {
        this.board = state.board;
        console.log("BOARD LOADED:", this.board);
      },
      error: err => console.error("API ERROR:", err)
    });
  }

  onCellClick(i: number, j: number) {
    console.log("Click:", i, j);
    this.gameService.makeMove(i, j).subscribe({
      next: () => this.loadBoard(),
      error: err => console.error("MOVE ERROR:", err)
    });
  }
}
