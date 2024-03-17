export interface RequiredTime {
    transportType: TransportType,
    minutes: number
}

export enum TransportType {
    Walking,
    Bicycle,
    Car,
    Boat
}