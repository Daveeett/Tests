export interface GetConfigurationResponse {
    Version: string;
    Workers: Workers;
    Dashboard: Dashboard;
    TimeZone: string;
    Logging: Logging;
    Otps: Otps;
    Smtp: Smtp;
    AllowedHosts: string;
    Files: Files;
    Kestrel: Kestrel;
    JWT: Jwt;
    FirstConfiguration: FirstConfiguration;
    FirstUser: FirstUser;
    FirstEnterprise: FirstEnterprise;
    Tenant: Tenant;
    ConnectionStrings: ConnectionStrings;
    Postgres: Postgres;
    Mongo: Mongo;
    ClientOrigin: string;
}

export interface Workers {
    SigningFlowReminder: WorkerExecution;
    TenantCleanSpace: WorkerExecutionDays;
    SigningFlowExpiration: WorkerExecutionHours;
}

export interface WorkerExecution {
    ExecutionInMinutes: number;
}

export interface WorkerExecutionDays {
    ExecutionInDays: number;
}

export interface WorkerExecutionHours {
    ExecutionInHours: number;
}

export interface Dashboard {
    ExpirationDaysToShow: number;
}

export interface Logging {
    LogLevel: LogLevel;
}

export interface LogLevel {
    Default: string;
    "Microsoft.AspNetCore": string;
}

export interface Otps {
    SigningFlowInvolvedSignExpirationInMinutes: number;
    RecoverPasswordExpirationInMinutes: number;
    MfaExpirationInMinutes: number;
}

export interface Smtp {
    Host: string;
    Port: number;
    Username: string;
    Password?: string;
    Sender: Sender;
    EnableSsl: boolean;
}

export interface Sender {
    Address: string;
    Name: string;
}

export interface Files {
    TempExpirationInDays: number;
    TempPath: string;
    MainPath: string;
    InProcess: string;
    Certificates: string;
    MultipartBodyLengthLimit: number;
}

export interface Kestrel {
    MaxRequestBodySize: number;
}

export interface Jwt {
    SecretKey: string;
    EncryptKey: string;
    ExpiresInMinutes: number;
    RefreshTokenExpirationInHours: number;
    Audience: string;
    Issuer: string;
}

export interface FirstConfiguration {
    App: App;
}

export interface App {
    Name: string;
    Description: string;
    LogoPath: string;
}

export interface FirstUser {
    FirstName: string;
    LastName: string;
    EmailAddress: string;
    Identification: string;
    Password?: string;
    PasswordHint?: string;
}

export interface FirstEnterprise {
    SocialReason: string;
    Identification: string;
    Address: string;
}

export interface Tenant {
    CacheDurationInDays: number;
    SqlScriptUrl: string;
    SqlScriptPath: string;
    TokenBaseUtils: string;
    AuthenticateCodeExpirationInHours: number;
    ManagerEmailAddress: string;
}

export interface ConnectionStrings {
    Postgres: string;
    Tenant: string;
    Redis: string;
}

export interface Postgres {
    Schema: string;
}

export interface Mongo {
    ConnectionString: string;
    DatabaseName: string;
}
