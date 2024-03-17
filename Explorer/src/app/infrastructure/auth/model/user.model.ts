export interface User {
    id: number;
    username: string;
    role: string;
    followers?: User[];
    notifications?: UserNotification[]; 
    isBlogEnabled?: boolean;
}

export interface UserInfo{
    id: number;
    username: string;
    role: UserRole;
    email: string;
    isActive: boolean;
}

  
export interface UserNotification {
    notificationId?: number;
    senderId: number;
    message: string;
    status?: notificationStatus;
    timestamp?: Date;
}

export enum notificationStatus {
    Unread = 0,
    Read = 1
}

export enum UserRole{
    administrator = 0,
    author,
    tourist
}