import { OrderItem } from './order-item.model';

export interface Order {
    id: number;
    user_id: number;
    total_amount: number;
    status: string;
    created_at?: Date;
    items?: OrderItem[];
} 