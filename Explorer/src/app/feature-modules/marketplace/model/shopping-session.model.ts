import { ShoppingEvent } from "./shopping-event.model";

export interface ShoppingSession {
    id?: number;
    userId: number;
    events: ShoppingEvent[];
    isActive: boolean;
}