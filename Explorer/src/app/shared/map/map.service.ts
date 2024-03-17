import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient) { }

  search(street: string): Observable<any> {
    return this.http.get(
      'https://nominatim.openstreetmap.org/search?format=json&q=' + street
    );
  }

  reverseSearch(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&<params>`
    );
  }

  getElevation(lat: number, lon: number): Observable<any> {
    // TODO: enable CORS
    // Metoda trenutno ne radi zbog CORS Policy-ja
    return this.http.get(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`);
  }

}