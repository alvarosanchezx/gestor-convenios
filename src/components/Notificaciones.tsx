import { useState, useEffect } from 'react';
import { Bell, Check, Mail, Plus, X } from 'lucide-react';
import { Convenio } from '../types/convenio';
import { supabase } from '../lib/supabase';
import { useConvenios } from '../contexts/ConveniosContext';

interface NotificationEmail {
  id: string;
  email: string;
}

export function Notificaciones() {
  const [globalDesktopEnabled, setGlobalDesktopEnabled] = useState(false);
  const [emails, setEmails] = useState<NotificationEmail[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [subscribedConvenios, setSubscribedConvenios] = useState<Convenio[]>([]);
  const { subscribedConvenios: subscribedIds } = useConvenios();

  useEffect(() => {
    fetchGlobalSettings();
    fetchEmails();
  }, []);

  useEffect(() => {
    fetchSubscribedConvenios();
  }, [subscribedIds]);

  const fetchSubscribedConvenios = async () => {
    if (subscribedIds.size === 0) {
      setSubscribedConvenios([]);
      return;
    }

    try {
      const { data } = await supabase
        .from('convenios_colectivos')
        .select('*')
        .in('id', Array.from(subscribedIds));

      setSubscribedConvenios(data || []);
    } catch (error) {
      console.error('Error fetching subscribed convenios:', error);
    }
  };

  const fetchGlobalSettings = async () => {
    try {
      const { data } = await supabase
        .from('global_notification_settings')
        .select('*')
        .maybeSingle();

      if (data) {
        setGlobalDesktopEnabled(data.desktop_notifications_enabled);
      }
    } catch (error) {
      console.error('Error fetching global settings:', error);
    }
  };

  const fetchEmails = async () => {
    try {
      const { data } = await supabase
        .from('notification_emails')
        .select('*')
        .order('created_at', { ascending: true });

      setEmails(data || []);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const handleGlobalDesktopToggle = async () => {
    const newValue = !globalDesktopEnabled;

    try {
      const { data: existing } = await supabase
        .from('global_notification_settings')
        .select('*')
        .maybeSingle();

      if (existing) {
        await supabase
          .from('global_notification_settings')
          .update({ desktop_notifications_enabled: newValue })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('global_notification_settings')
          .insert({ desktop_notifications_enabled: newValue });
      }

      setGlobalDesktopEnabled(newValue);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error updating global settings:', error);
    }
  };

  const handleAddEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      alert('Por favor, introduce un email válido');
      return;
    }

    if (emails.some((e) => e.email === newEmail)) {
      alert('Este email ya está añadido');
      return;
    }

    try {
      const { data } = await supabase
        .from('notification_emails')
        .insert({ email: newEmail })
        .select()
        .single();

      if (data) {
        setEmails([...emails, data]);
        setNewEmail('');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Error adding email:', error);
    }
  };

  const handleDeleteEmail = async (id: string) => {
    try {
      await supabase
        .from('notification_emails')
        .delete()
        .eq('id', id);

      setEmails(emails.filter((e) => e.id !== id));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Convenios Suscritos
          </h2>
          {saved && (
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm">
              <Check className="w-4 h-4" />
              Guardado
            </div>
          )}
        </div>

        {subscribedConvenios.length > 0 ? (
          <div className="space-y-2">
            {subscribedConvenios.map((convenio) => (
              <div
                key={convenio.id}
                className="p-4 border border-gray-200 dark:border-slate-700 rounded hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{convenio.nombre}</h3>
                    {convenio.codigo && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                        {convenio.codigo}
                      </p>
                    )}
                  </div>
                  <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300 rounded font-semibold">
                    Suscrito
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No tienes convenios suscritos. Añade convenios desde su ficha individual.
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Configuración Global</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Notificaciones de Escritorio</h3>
            <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
              <input
                type="checkbox"
                checked={globalDesktopEnabled}
                onChange={handleGlobalDesktopToggle}
                className="w-5 h-5 text-blue-700 rounded focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Activar notificaciones de escritorio (Windows)
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Recibe alertas en tu navegador para todos los convenios suscritos
                </p>
              </div>
            </label>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Direcciones de Email</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Añade hasta 2 direcciones de correo para recibir notificaciones
            </p>

            <div className="space-y-3 mb-4">
              {emails.map((emailItem) => (
                <div
                  key={emailItem.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 dark:border-slate-700 rounded-lg"
                >
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 text-sm text-gray-900 dark:text-white">{emailItem.email}</span>
                  <button
                    onClick={() => handleDeleteEmail(emailItem.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors text-red-700 dark:text-red-400"
                    title="Eliminar email"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {emails.length < 2 && (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddEmail();
                    }
                  }}
                  placeholder="ejemplo@correo.com"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                />
                <button
                  onClick={handleAddEmail}
                  className="px-4 py-2 bg-blue-700 text-white hover:bg-blue-800 rounded transition-colors font-medium text-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Añadir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Información</h3>
        <p className="text-sm text-blue-900 dark:text-blue-300">
          Las notificaciones te mantendrán informado sobre cambios en tablas salariales, revisiones y otras actualizaciones importantes de los convenios suscritos.
        </p>
      </div>
    </div>
  );
}
