/*
  # Add Location Fields to Convenios

  1. New Columns
    - `provincia` (text) - Province for provincial agreements
    - `comunidad_autonoma` (text) - Autonomous community for regional/provincial agreements
    - `ciudad` (text) - Specific city for company or local agreements

  2. Important Notes
    - These fields allow storing specific location information for different types of agreements
    - National agreements won't need these fields populated
    - Provincial agreements will have provincia and comunidad_autonoma
    - Regional/local agreements will have the specific locations
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'convenios_colectivos' AND column_name = 'provincia'
  ) THEN
    ALTER TABLE convenios_colectivos ADD COLUMN provincia text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'convenios_colectivos' AND column_name = 'comunidad_autonoma'
  ) THEN
    ALTER TABLE convenios_colectivos ADD COLUMN comunidad_autonoma text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'convenios_colectivos' AND column_name = 'ciudad'
  ) THEN
    ALTER TABLE convenios_colectivos ADD COLUMN ciudad text;
  END IF;
END $$;

DO $$
BEGIN
  UPDATE convenios_colectivos 
  SET 
    provincia = 'Barcelona',
    comunidad_autonoma = 'Cataluña'
  WHERE codigo = 'CC-BCN-2023-012';

  UPDATE convenios_colectivos
  SET
    comunidad_autonoma = 'Madrid'
  WHERE codigo = 'CC-MAD-2023-045';
END $$;
