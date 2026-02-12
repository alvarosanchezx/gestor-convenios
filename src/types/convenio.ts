export interface Convenio {
  id: string;
  nombre: string;
  codigo: string | null;
  ambito: string;
  sector: string | null;
  fecha_publicacion: string | null;
  fecha_vigencia_inicio: string | null;
  fecha_vigencia_fin: string | null;
  boletin_oficial: string | null;
  estado: string;
  contenido: string | null;
  datos_completos?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ConvenioStats {
  total: number;
  vigentes: number;
  porSector: Record<string, number>;
  proximosVencer: number;
}

export interface Publicacion {
  id: string;
  convenio_id: string;
  titulo: string;
  descripcion: string | null;
  tipo: string;
  fecha_publicacion: string;
  url: string | null;
  visto: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificacionConfig {
  id: string;
  convenio_id: string;
  push_notifications: boolean;
  email_notifications: boolean;
  creado_en: string;
  actualizado_en: string;
}
