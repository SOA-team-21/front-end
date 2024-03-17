import { Tour } from "./tour.model";

export interface Bundle {
    id: number,
    name: string,
    status: BundleStatus,
    price: number,
    tours: Tour[]
}

export enum BundleStatus {
    draft = 0,
    published = 1,
    arhived = 2
}