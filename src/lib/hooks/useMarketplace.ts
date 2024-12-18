import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Marketplace {
  name: string;
  logo?: string;
  description?: string;
}

export function useMarketplace() {
  const [marketplace, setMarketplace] = useState<Marketplace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMarketplace() {
      try {
        const marketplaceRef = doc(db, 'marketplaces', 'default');
        const marketplaceSnap = await getDoc(marketplaceRef);
        
        if (marketplaceSnap.exists()) {
          setMarketplace(marketplaceSnap.data() as Marketplace);
        } else {
          setMarketplace(null);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchMarketplace();
  }, []);

  return { marketplace, loading, error };
}
