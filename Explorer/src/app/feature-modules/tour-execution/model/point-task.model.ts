import { Point } from "../../tour-authoring/model/points.model";

export enum TaskType{
    Point = 1
}

export interface PointTask {
    done: boolean;
    doneOn: Date;
    type: TaskType;
    point: Point;
  }