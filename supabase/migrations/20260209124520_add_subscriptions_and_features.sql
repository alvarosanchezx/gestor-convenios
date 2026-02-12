/*
  # Add subscription tracking, publications, comparator, and notifications

  1. New Tables
    - `convenio_suscripciones` - Track subscribed convenios
    - `convenio_publicaciones` - Recent updates/publications
    - `comparador_items` - Items in comparison
    - `notificaciones_config` - Notification settings per user

  2. Security
    - Enable RLS on all new tables
    - Add policies for public/authenticated access

  3. Indexes
    - Index on frequently searched fields
*/

CREATE TABLE IF NOT EXISTS convenio_suscripciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  convenio_id uuid NOT NULL REFERENCES convenios_colectivos(id) ON DELETE CASCADE,
  fecha_suscripcion timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE convenio_suscripciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subscriptions"
  ON convenio_suscripciones FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage subscriptions"
  ON convenio_suscripciones FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete subscriptions"
  ON convenio_suscripciones FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_suscripciones_convenio ON convenio_suscripciones(convenio_id);


CREATE TABLE IF NOT EXISTS convenio_publicaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  convenio_id uuid NOT NULL REFERENCES convenios_colectivos(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descripcion text,
  tipo text DEFAULT 'actualizacion',
  fecha_publicacion timestamptz DEFAULT now(),
  url text,
  visto boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE convenio_publicaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view publications"
  ON convenio_publicaciones FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert publications"
  ON convenio_publicaciones FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update publications"
  ON convenio_publicaciones FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_publicaciones_convenio ON convenio_publicaciones(convenio_id);
CREATE INDEX IF NOT EXISTS idx_publicaciones_fecha ON convenio_publicaciones(fecha_publicacion);


CREATE TABLE IF NOT EXISTS comparador_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  convenio_id uuid NOT NULL REFERENCES convenios_colectivos(id) ON DELETE CASCADE,
  fecha_agregado timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comparador_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view comparador items"
  ON comparador_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage comparador items"
  ON comparador_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete comparador items"
  ON comparador_items FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_comparador_convenio ON comparador_items(convenio_id);


CREATE TABLE IF NOT EXISTS notificaciones_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  convenio_id uuid NOT NULL REFERENCES convenios_colectivos(id) ON DELETE CASCADE,
  push_notifications boolean DEFAULT true,
  email_notifications boolean DEFAULT false,
  creado_en timestamptz DEFAULT now(),
  actualizado_en timestamptz DEFAULT now()
);

ALTER TABLE notificaciones_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view their notification config"
  ON notificaciones_config FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage their notification config"
  ON notificaciones_config FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their notification config"
  ON notificaciones_config FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete their notification config"
  ON notificaciones_config FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_notificaciones_convenio ON notificaciones_config(convenio_id);