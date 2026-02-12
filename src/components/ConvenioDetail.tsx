import { Download, Plus, Scale, Bell, Check, Minus } from 'lucide-react';
import { Convenio, Publicacion } from '../types/convenio';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useConvenios } from '../contexts/ConveniosContext';
import { NotificationModal } from './NotificationModal';

interface ConvenioDetailProps {
  convenio: Convenio;
}

type TabType = 'tablas' | 'detalles' | 'publicaciones' | 'descarga';

export function ConvenioDetail({ convenio }: ConvenioDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('detalles');
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loadingPubs, setLoadingPubs] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { isSubscribed, toggleSubscription, isInComparador, toggleComparador } = useConvenios();

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        setLoadingPubs(true);
        const { data } = await supabase
          .from('convenio_publicaciones')
          .select('*')
          .eq('convenio_id', convenio.id)
          .order('fecha_publicacion', { ascending: false })
          .limit(10);

        setPublicaciones(data || []);
      } catch (error) {
        console.error('Error fetching publicaciones:', error);
      } finally {
        setLoadingPubs(false);
      }
    };

    fetchPublicaciones();
  }, [convenio.id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const datos = convenio.datos_completos as any || {};
  const tablaSalarial = datos.tablas_salariales || [];

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'detalles', label: 'Detalles', icon: 'ℹ️' },
    { id: 'tablas', label: 'Tablas Salariales', icon: '📊' },
    { id: 'publicaciones', label: 'Publicaciones', icon: '📰' },
    { id: 'descarga', label: 'Descargar', icon: '📥' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{convenio.nombre}</h1>
          {convenio.codigo && (
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono mt-1">{convenio.codigo}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-3 flex-shrink-0">
          <button
            onClick={async () => {
              try {
                await toggleSubscription(convenio.id);
              } catch (error) {
                console.error('Error toggling subscription:', error);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors font-medium text-sm ${
              isSubscribed(convenio.id)
                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300 border-2 border-emerald-700 dark:border-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/40'
                : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            {isSubscribed(convenio.id) ? (
              <>
                <Check className="w-4 h-4" />
                Convenio Añadido
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Añadir Convenio
              </>
            )}
          </button>
          <button
            onClick={() => toggleComparador(convenio.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors font-medium text-sm ${
              isInComparador(convenio.id)
                ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 border-2 border-blue-700 dark:border-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40'
                : 'bg-blue-700 text-white hover:bg-blue-800'
            }`}
            title={isInComparador(convenio.id) ? 'Quitar del comparador' : 'Añadir al comparador'}
          >
            {isInComparador(convenio.id) ? (
              <>
                <Check className="w-4 h-4" />
                En Comparador
              </>
            ) : (
              <>
                <Scale className="w-4 h-4" />
                Añadir al comparador
              </>
            )}
          </button>
          <button
            onClick={() => setShowNotificationModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-amber-700 text-white hover:bg-amber-800 rounded transition-colors font-medium text-sm"
            title="Configurar notificaciones"
          >
            <Bell className="w-4 h-4" />
            Notificaciones
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
        <div className="flex gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-2 px-4 py-3 rounded transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-b-2 border-blue-700 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === 'detalles' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Jornada anual (horas)
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {datos.jornada_anual || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Vacaciones (días)
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {datos.vacaciones_dias || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Período de prueba (días)
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {datos.periodo_prueba_dias || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Contratos temporales máximo (meses)
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {datos.contratos_temporales_max_meses || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Información General</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Ámbito
                    </p>
                    <p className="text-gray-900 dark:text-white capitalize">{convenio.ambito}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Sector
                    </p>
                    <p className="text-gray-900 dark:text-white">{convenio.sector || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Vigencia
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(convenio.fecha_vigencia_inicio)} - {formatDate(convenio.fecha_vigencia_fin)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Estado
                    </p>
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300 rounded text-xs font-semibold capitalize">
                      {convenio.estado}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Boletín Oficial
                    </p>
                    <p className="text-gray-900 dark:text-white">{convenio.boletin_oficial || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {convenio.contenido && (
                <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Descripción</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{convenio.contenido}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tablas' && (
            <div className="space-y-4">
              {tablaSalarial.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Categoría</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Salario Base</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Plus Convenio</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Total Anual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tablaSalarial.map((row: any, idx: number) => (
                        <tr
                          key={idx}
                          className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                        >
                          <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{row.categoria}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.salario_base}€</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.plus_convenio}€</td>
                          <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{row.total_anual}€</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No hay tablas salariales disponibles</p>
              )}
            </div>
          )}

          {activeTab === 'publicaciones' && (
            <div className="space-y-3">
              {loadingPubs ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 dark:bg-slate-800 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : publicaciones.length > 0 ? (
                publicaciones.map((pub) => (
                  <div
                    key={pub.id}
                    className="p-4 border border-gray-200 dark:border-slate-700 rounded hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white">{pub.titulo}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDateTime(pub.fecha_publicacion)}
                        </p>
                        {pub.descripcion && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{pub.descripcion}</p>
                        )}
                      </div>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-medium whitespace-nowrap">
                        {pub.tipo.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No hay publicaciones recientes</p>
              )}
            </div>
          )}

          {activeTab === 'descarga' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Download className="w-16 h-16 text-blue-700 dark:text-blue-400 mb-4" />
              <button className="flex items-center gap-2 px-8 py-4 bg-blue-700 text-white hover:bg-blue-800 rounded-lg transition-colors font-semibold text-lg mb-4">
                <Download className="w-6 h-6" />
                Descargar PDF
              </button>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Descarga el documento completo del convenio en formato PDF
              </p>
            </div>
          )}
        </div>
      </div>

      <NotificationModal
        convenioId={convenio.id}
        convenioNombre={convenio.nombre}
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
    </div>
  );
}
