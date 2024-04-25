export interface Person {
    id?: number;
    userId: number;
    Name: string;
    Surname: string;
    Picture: string;
    Bio: string;
    Quote: string;
    Xp: number;
    Level: number;
}

export interface Follower{
    userId: number;
    Name: string;
    Surname: string;
    Quote: string;
    Email: string;
}