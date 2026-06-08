export type UserRole = 'admin' | 'user' | 'unknown';

export interface User {
    Id: number;
    Name: string;
    Nickname: string;
    Email: string;
    Role: UserRole;
    Plan: string;
    Type?: string;
    Token?: string;
}

export interface AuthResponse {
    Data: User;
    Role: UserRole;
    Plan: string;
    Type: string;
    Token?: string;
}

export interface UserMetrics {
    mediaResultados: number;
    totalRealizados: number;
    categoriaMasRealizada: string;
}