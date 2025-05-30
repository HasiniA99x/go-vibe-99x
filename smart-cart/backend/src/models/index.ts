export interface User {
    id: number;
    email: string;
    password?: string;
    role: string;
    created_at?: Date;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    created_at?: Date;
}

export interface CartItem {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    created_at?: Date;
    name?: string;
    price?: number;
    image_url?: string;
}

export interface Order {
    id: number;
    user_id: number;
    total_amount: number;
    status: string;
    created_at?: Date;
    items?: OrderItem[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    name?: string;
    image_url?: string;
} 