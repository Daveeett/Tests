export interface UpdateTenantRequest {
    tenantId: number;
    enterpriseName?: string;
    schemaName?: string;
    domain?: string;
    isActive?: boolean;
    planId?: number;
    planExpireAt?: string;
}
