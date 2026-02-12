import { Home, FileText, Scale, Bell, Settings, BookOpen } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'convenios', label: 'Convenios Colectivos', icon: FileText },
    { id: 'comparador', label: 'Comparador', icon: Scale },
    { id: 'actualizaciones', label: 'Últimas Actualizaciones', icon: FileText },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-b from-blue-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-700 rounded flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Convenios</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Colectivos</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-l-4 border-blue-700 dark:border-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

    </aside>
  );
}
