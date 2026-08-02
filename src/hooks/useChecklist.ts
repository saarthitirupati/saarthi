import { useState, useEffect, useMemo } from 'react';
import { CHECKLIST_ITEMS } from '@/data/knowledge';

export function useChecklist() {
  const [homeChecklist, setHomeChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedChecklist: Record<string, boolean> = {};
      CHECKLIST_ITEMS.forEach(item => {
        savedChecklist[item.id] = localStorage.getItem(item.localStorageKey) === 'true';
      });
      setHomeChecklist(savedChecklist);
    }
  }, []);

  const toggleItem = (itemId: string, storageKey: string) => {
    const newState = !homeChecklist[itemId];
    setHomeChecklist(prev => ({ ...prev, [itemId]: newState }));
    localStorage.setItem(storageKey, String(newState));
  };

  const stats = useMemo(() => {
    const total = CHECKLIST_ITEMS.length;
    const checked = Object.values(homeChecklist).filter(Boolean).length;
    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
    return { total, checked, pct };
  }, [homeChecklist]);

  return {
    items: CHECKLIST_ITEMS,
    state: homeChecklist,
    stats,
    toggleItem
  };
}
