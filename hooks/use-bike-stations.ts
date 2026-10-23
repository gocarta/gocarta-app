import { useState, useEffect } from 'react';
import { getBikeStations } from '@/services/gbfs';
import type { Station } from '@/types/gbfs';

interface UseBikeStationsResult {
  stations: Station[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useBikeStations(autoRefresh = false): UseBikeStationsResult {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBikeStations();
      setStations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const interval = setInterval(() => {
      fetchStations();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  return {
    stations,
    loading,
    error,
    refresh: fetchStations,
  };
}
