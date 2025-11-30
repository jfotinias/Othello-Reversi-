import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { ChangeDetectorRef } from '@angular/core';


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

  onCellClick(i: number, j: number) {
    console.log("Click:", i, j);
    this.gameService.makeMove(i, j).subscribe({
      next: () => this.loadBoard(),
      error: err => console.error("MOVE ERROR:", err)
    });
  }
}
