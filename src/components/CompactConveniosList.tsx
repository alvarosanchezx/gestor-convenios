import { Convenio } from '../types/convenio';

interface CompactConveniosListProps {
  convenios: Convenio[];
  loading: boolean;
  onSelect: (convenio: Convenio) => void;
}

export function CompactConveniosList({ convenios, loading, onSelect }: CompactConveniosListProps) {
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
            </tr>
          </thead>
          <tbody>
            {convenios.map((convenio) => (
              <tr
                key={convenio.id}
                onClick={() => onSelect(convenio)}
                className="border-t border-gray-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-gray-900 dark:text-white font-medium hover:text-blue-700 dark:hover:text-blue-400">
                  {convenio.nombre}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-xs">
                  {convenio.codigo || 'N/A'}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 capitalize">
                  {convenio.ambito}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {convenio.sector || 'N/A'}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">
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
                <td className="px-4 py-3">
                  <span className={getEstadoBadge(convenio.estado)}>
                    {convenio.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
