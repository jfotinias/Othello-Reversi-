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
  boardFlat: number[] = [];

  constructor(private gameService: GameService) {}

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
  this.gameService.getState().subscribe({
    next: (state: any) => {
      this.board = state.board;
      this.boardFlat = state.board.flat();
      console.log("BOARD LOADED:", this.boardFlat);
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
