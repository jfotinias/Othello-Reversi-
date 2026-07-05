import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  setupGame(color: string, depth: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/setup_game/`, {
      human_color: color,
      depth: depth
    });
  }

  getState(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/state`);
  }

  makeMove(row: number, col: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/make_move/`, {
      row: row,
      col: col
    });
  }

  aiTurn(): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/ai_turn/`, {});
  }

  reset(): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/reset`, {});
  }
}
