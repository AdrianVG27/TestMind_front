export interface Test {
    id: number;
    titulo: string;
    estado_codigo: string;
    categoria_codigo: string;
    documento_id: number;
    configuracion: any;
}

export interface RealizarTest {
    id: number;
    titulo: string;
    configuracion: {
        total: number;
    };
    preguntas: Pregunta[];
}

export interface Pregunta {
    tipo: string;
    opciones: string[];
    enunciado: string;
}

export interface IntentoResultado {
    intento_id: number;
    nota: number;
    aciertos: number;
    total: number;
    feedback: FeedbackDetalle[];
}

export interface FeedbackDetalle {
    enunciado: string;
    tu_respuesta: string | string[] | null;
    correcta: string | string[];
    acierto: boolean;
}