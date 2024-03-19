export interface Point {
  longitude: number,
  latitude: number,
  public: boolean,
  name: string,
  description: string,
  picture: string
}

export interface GoPoint {
  id: number,
  tourId: number,
  Longitude: number,
  Latitude: number,
  Public: boolean,
  Name: string,
  Description: string,
  Picture: string
}