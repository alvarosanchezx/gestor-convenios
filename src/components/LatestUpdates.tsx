import { useState, useEffect } from 'react';
import { Publicacion, Convenio } from '../types/convenio';
import { supabase } from '../lib/supabase';

interface LatestUpdatesProps {
  convenios: Convenio[];
}

export function LatestUpdates({ convenios }: LatestUpdatesProps) {
  const [publicaciones, setPublicaciones] = useState<(Publicacion & { convenio?: Convenio })[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'todas' | 'no-vistas' | 'vistas'>('todas');

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        setLoading(true);
        const convenioIds = convenios.map((c) => c.id);

        if (convenioIds.length === 0) {
          setPublicaciones([]);
          return;
        }

        const { data } = await supabase
          .from('convenio_publicaciones')
          .select('*')
          .in('convenio_id', convenioIds)
          .order('fecha_publicacion', { ascending: false });

        const pubsWithConvenios = (data || []).map((pub) => ({
          ...pub,
          convenio: convenios.find((c) => c.id === pub.convenio_id),
        }));

        setPublicaciones(pubsWithConvenios);
      } catch (error) {
        console.error('Error fetching publicaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicaciones();
  }, [convenios]);

  const handleMarkAsViewed = async (pubId: string) => {
    try {
      await supabase
        .from('convenio_publicaciones')
        .update({ visto: true })
        .eq('id', pubId);

      setPublicaciones((prev) =>
        prev.map((p) => (p.id === pubId ? { ...p, visto: true } : p))
      );
    } catch (error) {
      console.error('Error updating publicacion:', error);
    }
  };

  const filteredPublicaciones = publicaciones.filter((pub) => {
    if (filter === 'vistas') return pub.visto;
    if (filter === 'no-vistas') return !pub.visto;
    return true;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const getTypeColor = (tipo: string) => {
    const colors = {
      tablas_salariales: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      revision: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      modificacion: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      actualizacion: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    };
    return colors[tipo as keyof typeof colors] || colors.actualizacion;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Últimas Actualizaciones</h2>

        <div className="flex gap-2 mb-6">
          {(['todas', 'no-vistas', 'vistas'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                filter === f
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {f === 'todas' && 'Todas'}
              {f === 'no-vistas' && 'No vistas'}
              {f === 'vistas' && 'Vistas'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-slate-800 rounded animate-pulse"></div>
            ))}
          </div>
        ) : filteredPublicaciones.length > 0 ? (
          <div className="space-y-3">
            {filteredPublicaciones.map((pub) => (
              <div
                key={pub.id}
                className={`p-4 border rounded transition-colors ${
                  pub.visto
                    ? 'bg-gray-50 dark:bg-slate-800/30 border-gray-200 dark:border-slate-700'
                    : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`font-medium ${pub.visto ? 'text-gray-700 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        {pub.titulo}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getTypeColor(pub.tipo)}`}>
                        {pub.tipo.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {pub.convenio?.nombre} • {formatDate(pub.fecha_publicacion)}
                    </p>
                    {pub.descripcion && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">{pub.descripcion}</p>
                    )}
                  </div>
                  {!pub.visto && (
                    <button
                      onClick={() => handleMarkAsViewed(pub.id)}
                      className="px-3 py-1 bg-blue-700 text-white hover:bg-blue-800 rounded text-xs font-medium whitespace-nowrap transition-colors"
                    >
                      Marcar como visto
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No hay actualizaciones en este filtro
          </p>
        )}
      </div>
    </div>
  );
}
