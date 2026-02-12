/*
  # Add detailed salary and specification data to convenios
  
  1. New Column
    - `datos_completos` (jsonb) - Contains salary tables, details, and other structured data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'convenios_colectivos' AND column_name = 'datos_completos'
  ) THEN
    ALTER TABLE convenios_colectivos ADD COLUMN datos_completos jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;