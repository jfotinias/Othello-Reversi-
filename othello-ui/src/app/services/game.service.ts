import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = environment.apiUrl;
  public currentGameId: string | null = null;

  constructor(private http: HttpClient) {}

  setupGame(color: string, depth: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/setup_game/`, {
      human_color: color,
      depth: depth
    }).pipe(
      tap((res: any) => {
        if (res && res.game_id) {
          this.currentGameId = res.game_id;
        }
      })
    );
  }

  getState(): Observable<any> {
    const params = new HttpParams().set('game_id', this.currentGameId || '');
    return this.http.get(`${this.apiUrl}/api/state`, { params });
  }

  makeMove(row: number, col: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/make_move/`, {
      game_id: this.currentGameId,
      row: row,
      col: col
    });
  }

  aiTurn(): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/ai_turn/`, {
      game_id: this.currentGameId
    });
  }

  reset(): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/reset`, {
      game_id: this.currentGameId
    });
  }
}

