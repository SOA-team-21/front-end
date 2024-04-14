export interface Person {
    id?: number;
    userId: number;
    name: string;
    surname: string;
    picture: string;
    bio: string;
    quote: string;
    xp: number;
    level: number;
}

export interface Follower{
    userId: number;
    name: string;
    surname: string;
    quote: string;
    email: string;
}