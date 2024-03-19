export interface RequiredTime {
    transportType: TransportType,
    minutes: number
}

export interface GoRequiredTime {
    id: number,
    tourId: number,
    TransportType: TransportType,
    Minutes: number
} 

export enum TransportType {
    Walking,
    Bicycle,
    Car
}