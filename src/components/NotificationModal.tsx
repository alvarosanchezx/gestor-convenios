import { useState, useEffect } from 'react';
import { X, Bell, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { NotificacionConfig } from '../types/convenio';

interface NotificationModalProps {
  convenioId: string;
  convenioNombre: string;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ convenioId, convenioNombre, isOpen, onClose }: NotificationModalProps) {
  const [config, setConfig] = useState<NotificacionConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchConfig();
    }
  }, [isOpen, convenioId]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('notificaciones_config')
        .select('*')
        .eq('convenio_id', convenioId)
        .maybeSingle();

      if (data) {
        setConfig(data);
      } else {
        setConfig({
          id: '',
          convenio_id: convenioId,
          push_notifications: false,
          email_notifications: false,
          creado_en: new Date().toISOString(),
          actualizado_en: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error fetching notification config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (type: 'push_notifications' | 'email_notifications', value: boolean) => {
    if (!config) return;

    const newValue = !value;
    const updatedConfig = { ...config, [type]: newValue };

    try {
      if (config.id) {
        await supabase
          .from('notificaciones_config')
          .update({ [type]: newValue })
          .eq('id', config.id);
      } else {
        const { data } = await supabase
          .from('notificaciones_config')
          .insert({
            convenio_id: convenioId,
            [type]: newValue,
            push_notifications: type === 'push_notifications' ? newValue : false,
            email_notifications: type === 'email_notifications' ? newValue : false,
          })
          .select()
          .single();

        if (data) {
          updatedConfig.id = data.id;
        }
      }

      setConfig(updatedConfig);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error updating notification config:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notificaciones</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Configura alertas para este convenio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              {convenioNombre}
            </p>
          </div>

          {loading ? (
            <div className="space-y-3">
              <div className="h-12 bg-gray-100 dark:bg-slate-800 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-100 dark:bg-slate-800 rounded animate-pulse"></div>
            </div>
          ) : config ? (
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                <input
                  type="checkbox"
                  checked={config.push_notifications}
                  onChange={() => handleToggle('push_notifications', config.push_notifications)}
                  className="w-5 h-5 text-blue-700 rounded focus:ring-2 focus:ring-blue-600"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Notificaciones de Escritorio</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Recibe alertas en tu navegador Windows
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                <input
                  type="checkbox"
                  checked={config.email_notifications}
                  onChange={() => handleToggle('email_notifications', config.email_notifications)}
                  className="w-5 h-5 text-blue-700 rounded focus:ring-2 focus:ring-blue-600"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Notificaciones por Email</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Recibe alertas en tu correo electrónico
                  </p>
                </div>
              </label>

              {saved && (
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded">
                  <Check className="w-4 h-4" />
                  <span>Configuración guardada</span>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-blue-700 text-white hover:bg-blue-800 rounded-lg transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
