export type CartType = {
    id: string;
    items: Item[];
}

export type Item = {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    type: string;
}

export class Cart implements CartType {
    id = crypto.randomUUID();
    items: Item[] = [];
}