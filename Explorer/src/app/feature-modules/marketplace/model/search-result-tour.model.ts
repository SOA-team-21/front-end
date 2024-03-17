import { Point } from "../../tour-authoring/model/points.model";

export interface SearchResultTour{
    id: number;
    name: string;
    description: string;
    price: number;
    points: Point[];
}