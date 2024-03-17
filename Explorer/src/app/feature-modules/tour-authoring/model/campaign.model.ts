import { Tour } from "./tour.model";

export interface Campaign {
    id: number;
    title: string;
    tours: Tour[];
    difficult: number;
    length: number;
    touristId: number;
}