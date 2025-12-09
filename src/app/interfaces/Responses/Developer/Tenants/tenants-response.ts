export interface Plan {
    planId: number;
    name: string;
    showName: string;
    description: string;
    price: number;
    features: any[];
    activatedAt: string;
    expireAt: string;
    createdAt: string | null;
}

export interface TenantsResponse {
    tenantId: number;
    enterpriseName: string;
    schemaName: string;
    domain: string;
    isActive: boolean;
    plan: Plan;
    createdAt: string;
    updatedAt: string;
}


