
export interface CreateTenantRequest {
  enterpriseName: string;
  identification: string;
  schemaName: string;
  domain: string;
  activateImmediately: boolean;
  plan: TenantCreatePlanRequest;
  firstUser: TenantCreateFirstUserRequest;
  smtp: TenantCreateSmtpRequest;
}

export interface TenantCreatePlanRequest {
  id: number;
  expireAt: string;
}

export interface TenantCreateFirstUserRequest {
  firstName: string;
  lastName: string;
  emailAddress: string;
  identification: string;
  password: string;
  passwordHint?: string;
}

export interface TenantCreateSmtpRequest {
  host: string;
  port: number;
  username: string;
  password: string;
  senderAddress: string;
  senderName: string;
  EnableSsl: boolean;
}
