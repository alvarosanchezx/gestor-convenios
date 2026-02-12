/*
  # Create convenios colectivos table

  1. New Tables
    - `convenios_colectivos`
      - `id` (uuid, primary key) - Unique identifier
      - `nombre` (text) - Name of the collective agreement
      - `codigo` (text) - Official code of the agreement
      - `ambito` (text) - Scope: nacional, autonómico, provincial, empresa
      - `sector` (text) - Labor sector
      - `fecha_publicacion` (date) - Publication date
      - `fecha_vigencia_inicio` (date) - Start date of validity
      - `fecha_vigencia_fin` (date) - End date of validity
      - `boletin_oficial` (text) - Official bulletin (BOE, DOGC, etc.)
      - `estado` (text) - Status: vigente, derogado, prorrogado
      - `contenido` (text) - Content or summary
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `convenios_colectivos` table
    - Add policies for public read access (convenios are public information)
    - Add policies for authenticated users to create, update, and delete

  3. Indexes
    - Add indexes for common search fields (nombre, codigo, ambito, sector, estado)
*/

CREATE TABLE IF NOT EXISTS convenios_colectivos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  codigo text,
  ambito text DEFAULT 'nacional',
  sector text,
  fecha_publicacion date,
  fecha_vigencia_inicio date,
  fecha_vigencia_fin date,
  boletin_oficial text,
  estado text DEFAULT 'vigente',
  contenido text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE convenios_colectivos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view convenios"
  ON convenios_colectivos FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert convenios"
  ON convenios_colectivos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update convenios"
  ON convenios_colectivos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete convenios"
  ON convenios_colectivos FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_convenios_nombre ON convenios_colectivos(nombre);
CREATE INDEX IF NOT EXISTS idx_convenios_codigo ON convenios_colectivos(codigo);
CREATE INDEX IF NOT EXISTS idx_convenios_ambito ON convenios_colectivos(ambito);
CREATE INDEX IF NOT EXISTS idx_convenios_sector ON convenios_colectivos(sector);
CREATE INDEX IF NOT EXISTS idx_convenios_estado ON convenios_colectivos(estado);
CREATE INDEX IF NOT EXISTS idx_convenios_fecha_vigencia ON convenios_colectivos(fecha_vigencia_inicio, fecha_vigencia_fin);