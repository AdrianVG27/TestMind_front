export interface TierConfig {
    precio: number;
    maxTests: number;
    maxExportaciones: number;
    maxPaginas: number;
    maxPreguntas: number;
}

export interface Tier {
    id: number;
    codigo: string;
    conf: TierConfig;
    valorUsado: boolean;
    paypal_id: string | null;
    descripcion?: string;
    created_at?: string;
    updated_at?: string;
}