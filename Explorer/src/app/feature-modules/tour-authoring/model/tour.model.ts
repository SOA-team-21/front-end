import { Point } from "../../tour-authoring/model/points.model"
import { Problem } from "./problem.model";
import { RequiredTime } from "./requiredTime.model";
import { TourReview } from "./tourReview.model";

export interface Tour {
    id: number,
    name: string,
    description: string,
    difficult: number,
    tags: Tag[],
    status: number,
    price: number,
    points: Point[],
    authorId: number
    length: number, 
    publishTime: string,
    arhiveTime: string,
    requiredTimes: RequiredTime[],
    reviews: TourReview[],
    problems: Problem[],
    myOwn?: boolean
}

export interface Tag{
    Name: string
}