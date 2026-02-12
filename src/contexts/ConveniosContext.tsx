import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Convenio } from '../types/convenio';

interface ConveniosContextType {
  subscribedConvenios: Set<string>;
  comparadorConvenios: Set<string>;
  toggleSubscription: (convenioId: string) => Promise<void>;
  toggleComparador: (convenioId: string) => void;
  isSubscribed: (convenioId: string) => boolean;
  isInComparador: (convenioId: string) => boolean;
  refreshSubscriptions: () => Promise<void>;
}

const ConveniosContext = createContext<ConveniosContextType | undefined>(undefined);

export function ConveniosProvider({ children }: { children: ReactNode }) {
  const [subscribedConvenios, setSubscribedConvenios] = useState<Set<string>>(new Set());
  const [comparadorConvenios, setComparadorConvenios] = useState<Set<string>>(new Set());

  const refreshSubscriptions = async () => {
    try {
      const { data } = await supabase
        .from('convenio_suscripciones')
        .select('convenio_id');

      if (data) {
        setSubscribedConvenios(new Set(data.map((s) => s.convenio_id)));
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  useEffect(() => {
    refreshSubscriptions();
  }, []);

  const toggleSubscription = async (convenioId: string) => {
    const isCurrentlySubscribed = subscribedConvenios.has(convenioId);

    try {
      if (isCurrentlySubscribed) {
        const { error } = await supabase
          .from('convenio_suscripciones')
          .delete()
          .eq('convenio_id', convenioId);

        if (error) throw error;

        setSubscribedConvenios((prev) => {
          const newSet = new Set(prev);
          newSet.delete(convenioId);
          return newSet;
        });
      } else {
        const { error } = await supabase
          .from('convenio_suscripciones')
          .insert({ convenio_id: convenioId });

        if (error) throw error;

        setSubscribedConvenios((prev) => new Set([...prev, convenioId]));
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
      throw error;
    }
  };

  const toggleComparador = (convenioId: string) => {
    setComparadorConvenios((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(convenioId)) {
        newSet.delete(convenioId);
      } else {
        if (newSet.size >= 3) {
          const firstItem = Array.from(newSet)[0];
          newSet.delete(firstItem);
        }
        newSet.add(convenioId);
      }
      return newSet;
    });
  };

  const isSubscribed = (convenioId: string) => subscribedConvenios.has(convenioId);
  const isInComparador = (convenioId: string) => comparadorConvenios.has(convenioId);

  return (
    <ConveniosContext.Provider
      value={{
        subscribedConvenios,
        comparadorConvenios,
        toggleSubscription,
        toggleComparador,
        isSubscribed,
        isInComparador,
        refreshSubscriptions,
      }}
    >
      {children}
    </ConveniosContext.Provider>
  );
}

export function useConvenios() {
  const context = useContext(ConveniosContext);
  if (context === undefined) {
    throw new Error('useConvenios must be used within a ConveniosProvider');
  }
  return context;
}
