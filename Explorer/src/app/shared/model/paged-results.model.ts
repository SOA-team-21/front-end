export interface PagedResults<T> {
    results: T[];
    totalCount: number;
    additionalInfo: string; // Add your custom property
    value: any; // Add another custom property
}
