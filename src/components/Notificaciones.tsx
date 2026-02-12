import { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { Convenio, NotificacionConfig } from '../types/convenio';
import { supabase } from '../lib/supabase';

interface NotificacionesProps {
  convenios: Convenio[];
}

export function Notificaciones({ convenios }: NotificacionesProps) {
  const [configs, setConfigs] = useState<Record<string, NotificacionConfig>>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setLoading(true);
        const convenioIds = convenios.map((c) => c.id);

        if (convenioIds.length === 0) {
          setConfigs({});
          return;
        }

        const { data } = await supabase
          .from('notificaciones_config')
          .select('*')
          .in('convenio_id', convenioIds);

        const configMap: Record<string, NotificacionConfig> = {};
        (data || []).forEach((config) => {
          configMap[config.convenio_id] = config;
        });

        setConfigs(configMap);
      } catch (error) {
        console.error('Error fetching notification configs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, [convenios]);

  const handleToggle = async (
    convenioId: string,
    type: 'push_notifications' | 'email_notifications',
    value: boolean
  ) => {
    const config = configs[convenioId];
    const newValue = !value;

    try {
      if (config) {
        await supabase
          .from('notificaciones_config')
          .update({ [type]: newValue })
          .eq('id', config.id);
      } else {
        await supabase.from('notificaciones_config').insert({
          convenio_id: convenioId,
          [type]: newValue,
          push_notifications: type === 'push_notifications' ? newValue : false,
          email_notifications: type === 'email_notifications' ? newValue : false,
        });
      }

      setConfigs((prev) => ({
        ...prev,
        [convenioId]: {
          ...((prev[convenioId] || {
            id: '',
            convenio_id: convenioId,
            push_notifications: false,
            email_notifications: false,
            creado_en: new Date().toISOString(),
            actualizado_en: new Date().toISOString(),
          }) as NotificacionConfig),
          [type]: newValue,
        },
      }));

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error updating notification config:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Configurar Notificaciones
          </h2>
          {saved && (
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm">
              <Check className="w-4 h-4" />
              Guardado
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-slate-800 rounded animate-pulse"></div>
            ))}
          </div>
        ) : convenios.length > 0 ? (
          <div className="space-y-4">
            {convenios.map((convenio) => {
              const config = configs[convenio.id] || {
                id: '',
                convenio_id: convenio.id,
                push_notifications: false,
                email_notifications: false,
                creado_en: new Date().toISOString(),
                actualizado_en: new Date().toISOString(),
              };

              return (
                <div
                  key={convenio.id}
                  className="p-4 border border-gray-200 dark:border-slate-700 rounded hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">{convenio.nombre}</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.push_notifications}
                        onChange={() =>
                          handleToggle(convenio.id, 'push_notifications', config.push_notifications)
                        }
                        className="w-5 h-5 text-blue-700 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Notificaciones push del navegador
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.email_notifications}
                        onChange={() =>
                          handleToggle(convenio.id, 'email_notifications', config.email_notifications)
                        }
                        className="w-5 h-5 text-blue-700 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Notificaciones por email</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No hay convenios para configurar notificaciones
          </p>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Información</h3>
        <p className="text-sm text-blue-900 dark:text-blue-300">
          Activa notificaciones para recibir alertas sobre cambios en tablas salariales, revisiones y otras actualizaciones importantes de los convenios que te interesan.
        </p>
      </div>
    </div>
  );
}
