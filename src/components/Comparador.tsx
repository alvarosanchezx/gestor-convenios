import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Convenio } from '../types/convenio';
import { useConvenios } from '../contexts/ConveniosContext';
import { supabase } from '../lib/supabase';

export function Comparador() {
  const { comparadorConvenios, toggleComparador } = useConvenios();
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConvenios();
  }, [comparadorConvenios]);

  const fetchConvenios = async () => {
    if (comparadorConvenios.size === 0) {
      setConvenios([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await supabase
        .from('convenios_colectivos')
        .select('*')
        .in('id', Array.from(comparadorConvenios));

      setConvenios(data || []);
    } catch (error) {
      console.error('Error fetching convenios:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-12">
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-6 animate-pulse"></div>
        <div className="h-64 bg-gray-100 dark:bg-slate-800 rounded animate-pulse"></div>
      </div>
    );
  }

  if (convenios.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-12 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">No hay convenios en el comparador</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Añade hasta 3 convenios desde su ficha individual usando el botón "Añadir al comparador"
        </p>
      </div>
    );
  }

  const fields = [
    { label: 'Ámbito', key: 'ambito' },
    { label: 'Sector', key: 'sector' },
    { label: 'Estado', key: 'estado' },
    { label: 'Vigencia', key: 'vigencia' },
    { label: 'Jornada anual', key: 'jornada' },
    { label: 'Vacaciones', key: 'vacaciones' },
    { label: 'Período de prueba', key: 'periodo_prueba' },
  ];

  const getFieldValue = (convenio: Convenio, fieldKey: string) => {
    const datos = convenio.datos_completos as any || {};

    switch (fieldKey) {
      case 'ambito':
        return convenio.ambito || 'N/A';
      case 'sector':
        return convenio.sector || 'N/A';
      case 'estado':
        return (
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
            convenio.estado === 'vigente'
              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300'
              : convenio.estado === 'derogado'
              ? 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300'
              : 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300'
          }`}>
            {convenio.estado}
          </span>
        );
      case 'vigencia':
        if (!convenio.fecha_vigencia_inicio) return 'N/A';
        const inicio = new Date(convenio.fecha_vigencia_inicio).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const fin = convenio.fecha_vigencia_fin ? new Date(convenio.fecha_vigencia_fin).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';
        return `${inicio} - ${fin}`;
      case 'jornada':
        return datos.jornada_anual ? `${datos.jornada_anual} horas` : 'Ver documento';
      case 'vacaciones':
        return datos.vacaciones_dias ? `${datos.vacaciones_dias} días` : 'Ver documento';
      case 'periodo_prueba':
        return datos.periodo_prueba_dias ? `${datos.periodo_prueba_dias} días` : 'Ver documento';
      default:
        return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Comparador de Convenios ({convenios.length}/3)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white w-48 bg-gray-50 dark:bg-slate-800">
                  Campo
                </th>
                {convenios.map((convenio) => (
                  <th
                    key={convenio.id}
                    className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white border-l border-gray-200 dark:border-slate-700 min-w-[250px]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{convenio.nombre}</p>
                        {convenio.codigo && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {convenio.codigo}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => toggleComparador(convenio.id)}
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors text-red-700 dark:text-red-400"
                        title="Quitar del comparador"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr
                  key={field.key}
                  className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800">
                    {field.label}
                  </td>
                  {convenios.map((convenio) => (
                    <td key={convenio.id} className="px-4 py-3 text-gray-700 dark:text-gray-300 border-l border-gray-200 dark:border-slate-700">
                      {getFieldValue(convenio, field.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            Compara hasta 3 convenios colectivos para encontrar diferencias en condiciones laborales, jornadas, vacaciones y más. Los detalles específicos están disponibles en los documentos completos.
          </p>
        </div>
      </div>
    </div>
  );
}
