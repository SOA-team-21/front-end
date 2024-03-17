export interface OrderItem {
    idType: number;
    name: string;
    price: number;
    image: string;
   couponCode?: string;
    type: string;
    toursInfo?: TourInfo[];
}

export interface TourInfo {
    id: number;
    name: string;
    image: string;
}

export enum OrderItemType {
    bundle = 'Bundle',
    singleTour = 'SingleTour'

}