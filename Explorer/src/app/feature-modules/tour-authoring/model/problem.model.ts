export interface Problem {
  id?: number;
  category: string;
  priority: boolean;
  description: string;
  time: Date;
  tourId: number;
  touristId: number;
  authorsSolution: string;
  isSolved: boolean;
  unsolvedProblemComment: string;
  deadline: Date;
}