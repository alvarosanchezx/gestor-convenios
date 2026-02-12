import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { StatsCards } from './components/StatsCards';
import { CompactConveniosList } from './components/CompactConveniosList';
import { ConvenioDetail } from './components/ConvenioDetail';
import { Comparador } from './components/Comparador';
import { LatestUpdates } from './components/LatestUpdates';
import { Notificaciones } from './components/Notificaciones';
import { useTheme } from './contexts/ThemeContext';
import { useConvenios } from './contexts/ConveniosContext';
import { supabase } from './lib/supabase';
import { Convenio, ConvenioStats } from './types/convenio';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { subscribedConvenios, refreshSubscriptions } = useConvenios();
  const [activeView, setActiveView] = useState('dashboard');
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [filteredConvenios, setFilteredConvenios] = useState<Convenio[]>([]);
  const [selectedConvenio, setSelectedConvenio] = useState<Convenio | null>(null);
  const [stats, setStats] = useState<ConvenioStats>({
    total: 0,
    vigentes: 0,
    porSector: {},
    proximosVencer: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAmbito, setSelectedAmbito] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');

  useEffect(() => {
    fetchConvenios();
  }, []);

  useEffect(() => {
    filterConvenios();
  }, [convenios, searchTerm, selectedAmbito, selectedEstado]);

  const fetchConvenios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('convenios_colectivos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setConvenios(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching convenios:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Convenio[]) => {
    const vigentes = data.filter((c) => c.estado === 'vigente').length;
    const porSector: Record<string, number> = {};

    data.forEach((convenio) => {
      if (convenio.sector) {
        porSector[convenio.sector] = (porSector[convenio.sector] || 0) + 1;
      }
    });

    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);

    const proximosVencer = data.filter((c) => {
      if (!c.fecha_vigencia_fin) return false;
      const endDate = new Date(c.fecha_vigencia_fin);
      return endDate > now && endDate <= threeMonthsFromNow;
    }).length;

    setStats({
      total: data.length,
      vigentes,
      porSector,
      proximosVencer,
    });
  };

  const filterConvenios = () => {
    let filtered = [...convenios];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.nombre.toLowerCase().includes(term) ||
          c.codigo?.toLowerCase().includes(term) ||
          c.sector?.toLowerCase().includes(term)
      );
    }

    if (selectedAmbito) {
      filtered = filtered.filter((c) => c.ambito === selectedAmbito);
    }

    if (selectedEstado) {
      filtered = filtered.filter((c) => c.estado === selectedEstado);
    }

    setFilteredConvenios(filtered);
  };

  const handleSelectConvenio = (convenio: Convenio) => {
    setSelectedConvenio(convenio);
    setActiveView('convenio-detail');
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (view !== 'convenio-detail') {
      setSelectedConvenio(null);
    }
  };

  const renderMainContent = () => {
    if (selectedConvenio && activeView === 'convenio-detail') {
      return (
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => handleViewChange('dashboard')}
              className="mb-6 px-4 py-2 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors font-medium"
            >
              ← Volver al Dashboard
            </button>
            <ConvenioDetail convenio={selectedConvenio} />
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-8 py-4 flex items-center justify-end">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300"
            title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>

        {activeView === 'dashboard' && (
          <>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedAmbito={selectedAmbito}
              onAmbitoChange={setSelectedAmbito}
              selectedEstado={selectedEstado}
              onEstadoChange={setSelectedEstado}
            />

            <div className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Gestión de Convenios Colectivos
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Sistema de gestión y consulta de convenios colectivos de trabajo en España
                  </p>
                </div>

                <StatsCards stats={stats} loading={loading} />

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Convenios ({filteredConvenios.length})
                  </h3>
                </div>

                <CompactConveniosList
                  convenios={filteredConvenios}
                  loading={loading}
                  onSelect={handleSelectConvenio}
                />
              </div>
            </div>
          </>
        )}

        {activeView === 'convenios' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Convenios Colectivos
              </h2>

              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedAmbito={selectedAmbito}
                onAmbitoChange={setSelectedAmbito}
                selectedEstado={selectedEstado}
                onEstadoChange={setSelectedEstado}
              />

              <div className="mt-6">
                <CompactConveniosList
                  convenios={filteredConvenios}
                  loading={loading}
                  onSelect={handleSelectConvenio}
                />
              </div>
            </div>
          </div>
        )}

        {activeView === 'comparador' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Comparador de Convenios
              </h2>
              <Comparador />
            </div>
          </div>
        )}

        {activeView === 'actualizaciones' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Últimas Actualizaciones
              </h2>
              <LatestUpdates convenios={convenios} />
            </div>
          </div>
        )}

        {activeView === 'notificaciones' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Notificaciones
              </h2>
              <Notificaciones />
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      <Sidebar activeView={activeView} onViewChange={handleViewChange} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {renderMainContent()}
      </main>
    </div>
  );
}

export default App;
