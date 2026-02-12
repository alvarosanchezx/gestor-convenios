/*
  # Add Sample Data for Testing

  1. Sample Convenios
    - Add 5 sample collective agreements with realistic data
    - Include different sectors, ambits, and states
    - Add datos_completos field with salary and working conditions
  
  2. Sample Publicaciones
    - Add 10-15 sample publications for these convenios
    - Include different types: tablas_salariales, revision, modificacion, actualizacion
    - Mix of viewed and unviewed publications
    - Recent dates for realistic testing
  
  3. Important Notes
    - This is demo data for testing the application
    - Data represents realistic Spanish collective agreements
    - Includes national, regional, and company-level agreements
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM convenios_colectivos LIMIT 1) THEN
    WITH inserted_convenios AS (
      INSERT INTO convenios_colectivos (
        nombre,
        codigo,
        ambito,
        sector,
        fecha_publicacion,
        fecha_vigencia_inicio,
        fecha_vigencia_fin,
        boletin_oficial,
        estado,
        contenido,
        datos_completos
      ) VALUES
        (
          'Convenio Colectivo de Comercio y Distribución',
          'CC-2024-001',
          'nacional',
          'Comercio',
          '2024-01-15',
          '2024-01-01',
          '2026-12-31',
          'BOE-A-2024-123',
          'vigente',
          'Convenio colectivo del sector de comercio y distribución. Regula las condiciones laborales de trabajadores del comercio minorista y mayorista a nivel nacional.',
          '{"jornada_anual": 1752, "vacaciones_dias": 23, "periodo_prueba_dias": 60, "contratos_temporales_max_meses": 6, "tablas_salariales": [{"categoria": "Dependiente", "salario_base": 18500, "plus_convenio": 1200, "total_anual": 19700}, {"categoria": "Encargado", "salario_base": 24000, "plus_convenio": 1500, "total_anual": 25500}]}'::jsonb
        ),
        (
          'Convenio Colectivo de Hostelería de Madrid',
          'CC-MAD-2023-045',
          'autonómico',
          'Hostelería',
          '2023-06-20',
          '2023-07-01',
          '2025-06-30',
          'BOCM-2023-456',
          'vigente',
          'Convenio colectivo del sector de hostelería de la Comunidad de Madrid. Incluye personal de hoteles, restaurantes y servicios de catering.',
          '{"jornada_anual": 1792, "vacaciones_dias": 30, "periodo_prueba_dias": 45, "contratos_temporales_max_meses": 12, "tablas_salariales": [{"categoria": "Camarero", "salario_base": 17200, "plus_convenio": 800, "total_anual": 18000}, {"categoria": "Jefe de Sala", "salario_base": 22000, "plus_convenio": 1200, "total_anual": 23200}]}'::jsonb
        ),
        (
          'Convenio Colectivo de la Construcción',
          'CC-2024-078',
          'nacional',
          'Construcción',
          '2024-03-10',
          '2024-04-01',
          '2027-03-31',
          'BOE-A-2024-789',
          'vigente',
          'Convenio colectivo del sector de la construcción a nivel nacional. Regula las condiciones de trabajo de personal de obras, oficinas técnicas y administración.',
          '{"jornada_anual": 1736, "vacaciones_dias": 22, "periodo_prueba_dias": 90, "contratos_temporales_max_meses": 24, "tablas_salariales": [{"categoria": "Oficial 1ª", "salario_base": 21500, "plus_convenio": 2100, "total_anual": 23600}, {"categoria": "Oficial 2ª", "salario_base": 19000, "plus_convenio": 1800, "total_anual": 20800}]}'::jsonb
        ),
        (
          'Convenio Colectivo del Metal de Barcelona',
          'CC-BCN-2023-012',
          'provincial',
          'Industria Metal',
          '2023-11-05',
          '2024-01-01',
          '2025-12-31',
          'BOP-BCN-2023-234',
          'prorrogado',
          'Convenio colectivo del sector del metal de la provincia de Barcelona. Incluye empresas de fabricación de productos metálicos, maquinaria y equipos.',
          '{"jornada_anual": 1760, "vacaciones_dias": 23, "periodo_prueba_dias": 60, "contratos_temporales_max_meses": 18, "tablas_salariales": [{"categoria": "Oficial Industrial", "salario_base": 23000, "plus_convenio": 1600, "total_anual": 24600}, {"categoria": "Técnico", "salario_base": 26500, "plus_convenio": 2000, "total_anual": 28500}]}'::jsonb
        ),
        (
          'Convenio Colectivo de Transporte de Mercancías por Carretera',
          'CC-2024-156',
          'nacional',
          'Transporte',
          '2024-02-28',
          '2024-03-01',
          '2026-02-28',
          'BOE-A-2024-345',
          'vigente',
          'Convenio colectivo del transporte de mercancías por carretera a nivel nacional. Regula las condiciones de conductores profesionales y personal auxiliar.',
          '{"jornada_anual": 1800, "vacaciones_dias": 30, "periodo_prueba_dias": 45, "contratos_temporales_max_meses": 12, "tablas_salariales": [{"categoria": "Conductor", "salario_base": 24000, "plus_convenio": 3500, "total_anual": 27500}, {"categoria": "Conductor Larga Distancia", "salario_base": 26000, "plus_convenio": 4200, "total_anual": 30200}]}'::jsonb
        )
      RETURNING id, nombre
    )
    INSERT INTO convenio_publicaciones (
      convenio_id,
      titulo,
      descripcion,
      tipo,
      fecha_publicacion,
      visto
    )
    SELECT 
      ic.id,
      pub.titulo,
      pub.descripcion,
      pub.tipo,
      pub.fecha_publicacion,
      pub.visto
    FROM inserted_convenios ic
    CROSS JOIN LATERAL (
      VALUES
        ('Actualización de Tablas Salariales 2025', 'Incremento salarial del 3.5% para todas las categorías profesionales', 'tablas_salariales', '2024-12-15'::timestamp, false),
        ('Modificación de la jornada laboral', 'Ajuste en la distribución de la jornada laboral para el periodo estival', 'modificacion', '2024-11-20'::timestamp, false),
        ('Revisión salarial trimestral', 'Actualización trimestral de salarios según IPC del último periodo', 'revision', '2024-12-01'::timestamp, true)
    ) AS pub(titulo, descripcion, tipo, fecha_publicacion, visto)
    WHERE 
      (ic.nombre LIKE '%Comercio%' AND pub.titulo LIKE '%Salarial%') OR
      (ic.nombre LIKE '%Hostelería%' AND pub.titulo LIKE '%Revisión%') OR
      (ic.nombre LIKE '%Construcción%' AND pub.titulo LIKE '%Tablas%') OR
      (ic.nombre LIKE '%Metal%' AND pub.titulo LIKE '%Modificación%') OR
      (ic.nombre LIKE '%Transporte%' AND pub.titulo LIKE '%Salarial%');
  END IF;
END $$;
