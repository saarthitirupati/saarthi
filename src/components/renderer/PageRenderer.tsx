'use client';

import React, { useEffect, useState } from 'react';
import SectionRenderer from './SectionRenderer';
import SkeletonRenderer from './SkeletonRenderer';
import ErrorRenderer from './ErrorRenderer';

export default function PageRenderer({ apiEndpoint, initialData }: { apiEndpoint: string, initialData?: any }) {
  const [data, setData] = useState<any>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialData) {
      setLoading(false);
      return;
    }
    
    async function fetchPageData() {
      try {
        const res = await fetch(apiEndpoint);
        if (!res.ok) throw new Error('Failed to fetch page data');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPageData();
  }, [initialData, apiEndpoint]);

  if (loading) {
    return <SkeletonRenderer />;
  }

  if (error || !data) {
    return <ErrorRenderer />;
  }

  return (
    <div className="pb-24 pt-2">
      {data.sections?.map((section: any) => (
        <SectionRenderer key={section.id || section.type} section={section} />
      ))}
    </div>
  );
}


