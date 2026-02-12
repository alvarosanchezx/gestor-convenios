import { Calendar, MapPin, Building2, FileText } from 'lucide-react';
import { Convenio } from '../types/convenio';

interface ConveniosListProps {
  convenios: Convenio[];
  loading: boolean;
}

export function ConveniosList({ convenios, loading }: ConveniosListProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getEstadoBadge = (estado: string) => {
    const styles = {
      vigente: 'inline-block px-3 py-1 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300 rounded text-xs font-semibold uppercase tracking-wide',
      derogado: 'inline-block px-3 py-1 bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300 rounded text-xs font-semibold uppercase tracking-wide',
      prorrogado: 'inline-block px-3 py-1 bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300 rounded text-xs font-semibold uppercase tracking-wide',
    };
    return styles[estado as keyof typeof styles] || styles.vigente;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded p-6 animate-pulse"
          >
            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (convenios.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded p-12 text-center">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-slate-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No se encontraron convenios
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Ajusta los filtros de búsqueda para ver resultados
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {convenios.map((convenio) => (
        <div
          key={convenio.id}
          className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded p-6 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group"
        >
          <div className="mb-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors mb-1 break-words">
                  {convenio.nombre}
                </h3>
                {convenio.codigo && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {convenio.codigo}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <span className={getEstadoBadge(convenio.estado)}>
                  {convenio.estado}
                </span>
              </div>
            </div>
            {convenio.contenido && (
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                {convenio.contenido}
              </p>
            )}
          </div>

          <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Ámbito
                </p>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <span className="capitalize">{convenio.ambito}</span>
                </div>
              </div>
              {convenio.sector && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Sector
                  </p>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Building2 className="w-4 h-4 flex-shrink-0 text-gray-400" />
                    <span>{convenio.sector}</span>
                  </div>
                </div>
              )}
              {convenio.fecha_vigencia_inicio && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Vigencia
                  </p>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 flex-shrink-0 text-gray-400" />
                    <span className="text-xs">
                      {formatDate(convenio.fecha_vigencia_inicio)} - {formatDate(convenio.fecha_vigencia_fin)}
                    </span>
                  </div>
                </div>
              )}
              {convenio.boletin_oficial && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Boletín
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">{convenio.boletin_oficial}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
