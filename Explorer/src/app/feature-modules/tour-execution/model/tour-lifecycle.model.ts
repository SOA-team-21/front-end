export enum TourExecutionStatus{
    Active = 1,
    Completed,
    Abandoned
}

export interface GoTourExecution{
    id: number; 
    tourId: number;
    touristId: number;
    Status: TourExecutionStatus;
    Position: GoPosition;
    Tasks: GoPointTask[]; 
}

export interface GoToken{
    tourId: number;
    touristId: number;
}

export interface GoPointTask {
    tourExecutionId: number;
    tourId: number;
    keyPointId: number;
    Done: boolean;
    DoneOn: Date;
  }

  export interface GoPosition { //Tourist position
    Longitude: number,
    Latitude: number,
    LastActivity: Date,
  }