import { FileText, CheckCircle, Trash2 } from 'lucide-react';
import { ConvenioStats } from '../types/convenio';

interface StatsCardsProps {
  stats: ConvenioStats;
  loading: boolean;
  onFilterChange?: (filter: 'vigente' | 'derogado' | null) => void;
  currentFilter?: string | null;
}

export function StatsCards({ stats, loading, onFilterChange, currentFilter }: StatsCardsProps) {
  const caducados = stats.total - stats.vigentes;

  const cards = [
    {
      id: 'total',
      title: 'Total Convenios',
      value: stats.total,
      icon: FileText,
      iconColor: 'text-blue-700 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-900/40',
      bgLight: 'bg-blue-50 dark:bg-blue-900/10',
      clickable: false,
    },
    {
      id: 'vigente',
      title: 'Convenios Vigentes',
      value: stats.vigentes,
      icon: CheckCircle,
      iconColor: 'text-emerald-700 dark:text-emerald-400',
      borderColor: 'border-emerald-200 dark:border-emerald-900/40',
      bgLight: 'bg-emerald-50 dark:bg-emerald-900/10',
      clickable: true,
      filterValue: 'vigente' as const,
    },
    {
      id: 'caducados',
      title: 'Convenios Caducados',
      value: caducados,
      icon: Trash2,
      iconColor: 'text-red-700 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-900/40',
      bgLight: 'bg-red-50 dark:bg-red-900/10',
      clickable: true,
      filterValue: 'derogado' as const,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = currentFilter === (card.filterValue || null);

        return (
          <button
            key={card.id}
            onClick={() => {
              if (card.clickable && onFilterChange) {
                if (isActive) {
                  onFilterChange(null);
                } else {
                  onFilterChange(card.filterValue!);
                }
              }
            }}
            disabled={!card.clickable}
            className={`text-left bg-white dark:bg-slate-900 border rounded p-6 transition-all ${
              card.borderColor
            } ${card.bgLight} ${
              card.clickable
                ? 'cursor-pointer hover:shadow-md hover:scale-105'
                : 'cursor-default'
            } ${isActive ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-950' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">
              {card.title}
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {card.value.toLocaleString()}
            </p>
            {card.clickable && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                {isActive ? 'Haz clic para limpiar filtro' : 'Haz clic para filtrar'}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
