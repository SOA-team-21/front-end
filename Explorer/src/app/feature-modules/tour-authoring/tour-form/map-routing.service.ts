import { Injectable } from '@angular/core';
import { TransportType } from '../model/requiredTime.model';
import * as L from 'leaflet';
import * as turf from '@turf/turf';
import * as polyline from 'polyline';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapRoutingService {

transportationType: string = "driving-car"; //this is default value
_openRouteBaseUrl: string = `https://api.openrouteservice.org/v2/directions/`;
private _apiKey  = "5b3ce3597851110001cf6248a8d54c89f42a4e3cacf00d8cf7215653";

constructor(private http: HttpClient) { }

  changeTransportationType(newType: TransportType): void{
    if(newType.toString() === "TransportType.Bicycle"){
      this.transportationType = this.transportationType = "cycling-regular"; return;
    }
    else if(newType.toString() === "TransportType.Car"){
      this.transportationType = "driving-car"; return;
    }
    else if(newType.toString() === "TransportType.Walking"){
      this.transportationType = "foot-walking"; return;
    }
  }

  calculateRoute(markers: L.Marker[]): Observable<{ route: any, routeLength: number, routeDuration: number }> {
    const coordinates = markers.map(marker => marker.getLatLng()).map(latlng => [latlng.lng, latlng.lat]);
    return new Observable(observer => {
      this.http.post<any>(this._openRouteBaseUrl + this.transportationType + "?api_key=" + this._apiKey, {
        coordinates: coordinates
      }).subscribe({
        next: (response) => {
          const routeLength = turf.length(turf.lineString(coordinates), { units: 'kilometers' });
          observer.next({ route: this.decodeGeometry(response.routes[0].geometry), routeLength: routeLength, routeDuration: response.routes[0].summary.duration }); //Duration is in seconds
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  decodeGeometry(geometryString: string): L.LatLng[]{
      const decodedCoordinates = polyline.decode(geometryString);
      const latLngs = decodedCoordinates.map(coord => L.latLng(coord[0], coord[1]));
      return latLngs;
  }
}