import { PointTask } from "./point-task.model";
import { Position } from "./position.model";

export enum TourExecutionStatus{
    Active = 1,
    Completed,
    Abandoned
}

export interface TourExecution{
    id: number; 
    status: TourExecutionStatus;
    position: Position;
    tasks: PointTask[] | null; 
}