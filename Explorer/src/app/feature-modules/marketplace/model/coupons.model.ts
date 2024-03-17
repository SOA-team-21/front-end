export interface Coupon {
    id: number;
    code: string;
    discount: number;
    expiryDate: Date;
    tourId: number;
    authorId: number;
}