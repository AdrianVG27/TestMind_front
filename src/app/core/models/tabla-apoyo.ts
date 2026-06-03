export interface TablaApoyo {
  id: number;
  nombreTA: string;
  descripcion: string;
}

export interface TablaDataResponse {
  tabla: string;
  descripcion: string;
  registros: any[];
  tieneLenguajes: boolean;
}