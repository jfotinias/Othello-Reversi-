import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  setupGame(color: string, depth: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/setup_game/`, {
      human_color: color,
      depth: depth
    });
  }

  getState(): Observable<any> {
    return this.http.get(`${this.apiUrl}/state`);
  }

  makeMove(row: number, col: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/make_move/`, {
      row: row,
      col: col
    });
  }

  aiTurn(): Observable<any> {
    return this.http.post(`${this.apiUrl}/ai_turn/`, {});
  }

  reset(): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset`, {});
  }
}
