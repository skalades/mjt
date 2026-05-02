export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};

// ─── Shared Model Types ──────────────────────────────────────────

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

export interface OrderItem {
    id: number;
    order_id: number;
    item_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

export interface OrderMaterialUsage {
    id: number;
    order_id: number;
    inventory_item_id: number;
    quantity: number;
    unit_cost: number;
    total_cost: number;
    notes: string | null;
    created_at: string;
    inventory_item: {
        id: number;
        name: string;
        unit: string;
        purchase_price: number;
    };
}

export interface FinanceTransaction {
    id: number;
    type: 'IN' | 'OUT';
    category: string;
    amount: number;
    payment_method: string;
    status: 'SUCCESS' | 'PENDING' | 'REJECTED';
    transaction_date: string;
    maturity_date?: string | null;
    reference_number?: string | null;
    source?: string | null;
    notes?: string | null;
    referenceable_type?: string | null;
    referenceable_id?: number | null;
    created_at: string;
}

export interface Order {
    id: number;
    order_number: string;
    client_name: string;
    status: 'DRAFT' | 'PRODUCTION' | 'QC' | 'SHIPPED' | 'CANCELLED';
    payment_status: 'UNPAID' | 'PARTIAL' | 'PAID';
    total_amount: number;
    paid_amount: number;
    total_cost: number;
    gross_profit: number;
    due_date: string;
    created_at: string;
    items: OrderItem[];
    finance_transactions: FinanceTransaction[];
    material_usages: OrderMaterialUsage[];
}

export interface InventoryItem {
    id: number;
    sku: string;
    name: string;
    description?: string;
    unit: string;
    purchase_price: number;
    min_stock_threshold: number;
    current_stock: number;
    transactions: InventoryTransaction[];
}

export interface InventoryTransaction {
    id: number;
    inventory_item_id: number;
    type: 'IN' | 'OUT' | 'PRODUCTION_USAGE';
    quantity: number;
    reference_id?: string | null;
    notes?: string | null;
    created_by?: number | null;
    created_at: string;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    is_active: boolean;
}

export interface Mold {
    id: number;
    client_name: string | null;
    name: string;
    mold_code: string;
    total_shots: number;
    status: 'ACTIVE' | 'MAINTENANCE' | 'RETIRED';
    location: string | null;
}

export interface DashboardStats {
    total_orders: number;
    orders_today: number;
    total_items: number;
    low_stock_count: number;
    balance: number;
    revenue: number;
    monthly_revenue: number;
    material_cost: number;
    gross_profit: number;
    net_profit: number;
    expenses: number;
}

export interface FinanceSummary {
    total_balance: number;
    pending_giro: number;
    total_income: number;
    total_expense: number;
    material_cost: number;
}
