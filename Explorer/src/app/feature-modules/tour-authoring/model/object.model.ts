export enum Category {
  wc,
  restaurant,
  parking,
  other
}

export interface Object {
  id?: number,
  longitude: number,
  latitude: number,
  name: string,
  description: string,
  picture: string,
  category: Category
}
