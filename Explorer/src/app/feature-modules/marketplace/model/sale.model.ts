import { Tour } from "../../tour-authoring/model/tour.model";

export interface Sale {
    id: number;
    toursOnSale: Tour[]; 
    saleStart: Date;      
    saleEnd: Date;      
    discountPercentage: number;
    isActive: boolean;  
}