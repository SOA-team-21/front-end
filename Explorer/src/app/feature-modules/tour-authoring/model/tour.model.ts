import { GoPoint, Point } from "../../tour-authoring/model/points.model"
import { Problem } from "./problem.model";
import { GoRequiredTime, RequiredTime } from "./requiredTime.model";
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

export interface GoTour{
    id: number,
    Name: string,
    Description: string,
    Difficult: number,
    Tags: string[],
    Status: number,
    Price: number,
    KeyPoints: GoPoint[],
    authorId: number
    Length: number, 
    PublishTime: string,
    ArchiveTime: string,
    RequiredTimes: GoRequiredTime[],
    MyOwn?: boolean
}