import { FileText, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { ConvenioStats } from '../types/convenio';

interface StatsCardsProps {
  stats: ConvenioStats;
  loading: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Convenios',
      value: stats.total,
      icon: FileText,
      iconColor: 'text-blue-700 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-900/40',
      bgLight: 'bg-blue-50 dark:bg-blue-900/10',
    },
    {
      title: 'Convenios Vigentes',
      value: stats.vigentes,
      icon: CheckCircle,
      iconColor: 'text-emerald-700 dark:text-emerald-400',
      borderColor: 'border-emerald-200 dark:border-emerald-900/40',
      bgLight: 'bg-emerald-50 dark:bg-emerald-900/10',
    },
    {
      title: 'Sectores Activos',
      value: Object.keys(stats.porSector).length,
      icon: TrendingUp,
      iconColor: 'text-slate-700 dark:text-slate-400',
      borderColor: 'border-slate-200 dark:border-slate-700',
      bgLight: 'bg-slate-50 dark:bg-slate-800/20',
    },
    {
      title: 'Próximos a Vencer',
      value: stats.proximosVencer,
      icon: AlertCircle,
      iconColor: 'text-amber-700 dark:text-amber-400',
      borderColor: 'border-amber-200 dark:border-amber-900/40',
      bgLight: 'bg-amber-50 dark:bg-amber-900/10',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`bg-white dark:bg-slate-900 border rounded p-6 transition-shadow hover:shadow-md ${card.borderColor} ${card.bgLight}`}
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
          </div>
        );
      })}
    </div>
  );
}
