import { OrderItem } from "./order-item.model";

export interface ShoppingCart {
    id: number;
    idUser: number;
    items: OrderItem[];
}