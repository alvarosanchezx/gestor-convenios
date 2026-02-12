import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Convenio } from '../types/convenio';
import { useConvenios } from '../contexts/ConveniosContext';

interface CompactConveniosListProps {
  convenios: Convenio[];
  loading: boolean;
  onSelect: (convenio: Convenio) => void;
  showDeleteButton?: boolean;
}

export function CompactConveniosList({ convenios, loading, onSelect, showDeleteButton = false }: CompactConveniosListProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const { toggleSubscription } = useConvenios();
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getEstadoBadge = (estado: string) => {
    const styles = {
      vigente: 'px-2 py-0.5 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300 rounded text-xs font-semibold',
      derogado: 'px-2 py-0.5 bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300 rounded text-xs font-semibold',
      prorrogado: 'px-2 py-0.5 bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300 rounded text-xs font-semibold',
    };
    return styles[estado as keyof typeof styles] || styles.vigente;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded overflow-hidden">
        <div className="h-10 bg-gray-100 dark:bg-slate-800 animate-pulse"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-8 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (convenios.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">No hay convenios para mostrar</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Código</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Ámbito</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Sector</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Vigencia</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Estado</th>
              {showDeleteButton && (
                <th className="px-4 py-3 w-16"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {convenios.map((convenio) => (
              <tr
                key={convenio.id}
                onMouseEnter={() => setHoveredRow(convenio.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className="border-t border-gray-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group"
              >
                <td
                  onClick={() => onSelect(convenio)}
                  className="px-4 py-3 text-gray-900 dark:text-white font-medium hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer"
                >
                  {convenio.nombre}
                </td>
                <td
                  onClick={() => onSelect(convenio)}
                  className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-xs cursor-pointer"
                >
                  {convenio.codigo || 'N/A'}
                </td>
                <td
                  onClick={() => onSelect(convenio)}
                  className="px-4 py-3 text-gray-600 dark:text-gray-400 capitalize cursor-pointer"
                >
                  {convenio.ambito}
                </td>
                <td
                  onClick={() => onSelect(convenio)}
                  className="px-4 py-3 text-gray-600 dark:text-gray-400 cursor-pointer"
                >
                  {convenio.sector || 'N/A'}
                </td>
                <td
                  onClick={() => onSelect(convenio)}
                  className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap cursor-pointer"
                >
                  {convenio.fecha_vigencia_inicio ? (
                    <>
                      {formatDate(convenio.fecha_vigencia_inicio)}
                      <br />
                      {formatDate(convenio.fecha_vigencia_fin)}
                    </>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td
                  onClick={() => onSelect(convenio)}
                  className="px-4 py-3 cursor-pointer"
                >
                  <span className={getEstadoBadge(convenio.estado)}>
                    {convenio.estado}
                  </span>
                </td>
                {showDeleteButton && (
                  <td className="px-4 py-3">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await toggleSubscription(convenio.id);
                        } catch (error) {
                          console.error('Error removing subscription:', error);
                        }
                      }}
                      className={`p-2 rounded transition-all ${
                        hoveredRow === convenio.id
                          ? 'opacity-100 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400'
                          : 'opacity-0'
                      }`}
                      title="Eliminar convenio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
