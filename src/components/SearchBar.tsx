import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedAmbito: string;
  onAmbitoChange: (value: string) => void;
  selectedEstado: string;
  onEstadoChange: (value: string) => void;
}

export function SearchBar({
  searchTerm,
  onSearchChange,
  selectedAmbito,
  onAmbitoChange,
  selectedEstado,
  onEstadoChange,
}: SearchBarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Buscar convenio por nombre, código o sector..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <div className="flex gap-3 flex-shrink-0">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
              <select
                value={selectedAmbito}
                onChange={(e) => onAmbitoChange(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none appearance-none cursor-pointer min-w-[160px] text-sm"
              >
                <option value="">Todos los ámbitos</option>
                <option value="nacional">Nacional</option>
                <option value="autonómico">Autonómico</option>
                <option value="provincial">Provincial</option>
                <option value="empresa">Empresa</option>
              </select>
            </div>

            <div className="relative">
              <select
                value={selectedEstado}
                onChange={(e) => onEstadoChange(e.target.value)}
                className="pl-4 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none appearance-none cursor-pointer min-w-[140px] text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="vigente">Vigente</option>
                <option value="derogado">Derogado</option>
                <option value="prorrogado">Prorrogado</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
