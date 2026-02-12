import { X } from 'lucide-react';
import { Convenio } from '../types/convenio';

interface ComparadorProps {
  items: Convenio[];
  onRemove: (convenioId: string) => void;
}

export function Comparador({ items, onRemove }: ComparadorProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-12 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-2">No hay convenios en el comparador</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Selecciona 2 o 3 convenios para compararlos
        </p>
      </div>
    );
  }

  const fields = [
    { label: 'Jornada anual', key: 'jornada' },
    { label: 'Vacaciones', key: 'vacaciones' },
    { label: 'Período de prueba', key: 'periodo_prueba' },
    { label: 'Categorías profesionales', key: 'categorias' },
    { label: 'Salario base', key: 'salario' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Comparador de Convenios</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white w-48">Campo</th>
                {items.map((convenio) => (
                  <th
                    key={convenio.id}
                    className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white border-l border-gray-200 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex-1">{convenio.nombre}</span>
                      <button
                        onClick={() => onRemove(convenio.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field, idx) => (
                <tr
                  key={field.key}
                  className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-900">
                    {field.label}
                  </td>
                  {items.map((convenio) => (
                    <td key={convenio.id} className="px-4 py-3 text-gray-600 dark:text-gray-400 border-l border-gray-200 dark:border-slate-700">
                      <span className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">
                        Datos disponibles en el documento
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            Los detalles específicos de jornada, vacaciones, categorías y salarios están disponibles en los documentos PDF de cada convenio.
          </p>
        </div>
      </div>
    </div>
  );
}
