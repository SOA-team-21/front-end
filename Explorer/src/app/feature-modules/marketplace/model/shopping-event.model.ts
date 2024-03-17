export interface ShoppingEvent {
    eventType: EventType;
    itemId?: number;
    timestamp?: Date;
}

export enum EventType {
    OpenSession,
    AddTourToCart,
    RemoveTourFromCart,
    AddBundleToCart,
    RemoveBundleFromCart,
    CloseSession,
    ExpiredSession,
}